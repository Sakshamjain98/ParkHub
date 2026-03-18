import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'
import pino, { Logger } from 'pino'

type LogLevel = 'info' | 'warn' | 'error'
type WebhookType = 'generic' | 'slack' | 'discord'

type LogRecord = {
  level: LogLevel
  event: string
  message: string
  path?: string
  method?: string
  statusCode?: number
  durationMs?: number
  ip?: string
  requestId?: string
  metadata?: Record<string, unknown>
}

type AlertEntry = Record<string, unknown> & {
  source: string
  severity: 'warning' | 'critical'
  timestamp: string
  event?: string
  method?: string
  path?: string
  statusCode?: number
  requestId?: string
  ip?: string
  metadata?: Record<string, unknown>
}

@Injectable()
export class StructuredLoggerService implements OnModuleDestroy {
  private readonly redisUrl = process.env.REDIS_URL
  private readonly streamName = process.env.LOG_STREAM_NAME || 'autospace:logs'
  private readonly streamMaxLen = Number(process.env.LOG_STREAM_MAXLEN || 50000)
  private readonly logFilePath =
    process.env.LOG_FILE_PATH || `${process.cwd()}/logs/api.log`
  private readonly enableFileLogging =
    String(process.env.ENABLE_FILE_LOGGING || 'true').toLowerCase() !== 'false'
  private readonly alertWebhookUrl = process.env.ALERT_WEBHOOK_URL?.trim()
  private readonly alertWebhookType =
    (process.env.ALERT_WEBHOOK_TYPE?.trim().toLowerCase() as WebhookType) ||
    'generic'
  private readonly alertTimeoutMs = Number(process.env.ALERT_TIMEOUT_MS || 5000)
  private readonly alertCooldownSeconds = Number(
    process.env.ALERT_COOLDOWN_SECONDS || 60,
  )
  private readonly lastAlertAt = new Map<string, number>()
  private readonly redis = this.redisUrl
    ? new Redis(this.redisUrl, {
        maxRetriesPerRequest: 3,
      })
    : null
  private readonly fileLogger: Logger | null = this.enableFileLogging
    ? pino(
        {
          base: undefined,
          timestamp: pino.stdTimeFunctions.isoTime,
        },
        pino.destination({
          dest: this.logFilePath,
          mkdir: true,
          sync: false,
        }),
      )
    : null

  private readonly sensitiveKeys = [
    'authorization',
    'cookie',
    'password',
    'token',
    'secret',
    'apiKey',
  ]

  async log(record: LogRecord) {
    const entry = {
      timestamp: new Date().toISOString(),
      ...record,
    }
    const serialized = JSON.stringify(entry)

    if (record.level === 'error') {
      console.error(serialized)
    } else {
      console.log(serialized)
    }

    if (this.fileLogger) {
      if (record.level === 'error') {
        this.fileLogger.error(entry)
      } else if (record.level === 'warn') {
        this.fileLogger.warn(entry)
      } else {
        this.fileLogger.info(entry)
      }
    }

    if (this.redis) {
      try {
        await this.redis.xadd(
          this.streamName,
          'MAXLEN',
          '~',
          this.streamMaxLen,
          '*',
          'log',
          serialized,
        )
      } catch {
        // best-effort centralized logging
      }
    }

    if (this.shouldAlert(entry)) {
      await this.sendAlert(entry)
    }
  }

  private shouldAlert(entry: {
    level: LogLevel
    event: string
    statusCode?: number
  }) {
    if (entry.level === 'error') {
      return true
    }
    if (entry.statusCode === 429) {
      return true
    }
    if (entry.statusCode && entry.statusCode >= 500) {
      return true
    }
    return entry.event === 'waf_block'
  }

  private async sendAlert(entry: Record<string, unknown>) {
    if (!this.alertWebhookUrl) {
      return
    }

    const key = `${entry.event || 'event'}:${entry.path || ''}:${
      entry.statusCode || ''
    }`
    const now = Date.now()
    const last = this.lastAlertAt.get(key) || 0
    if (now - last < this.alertCooldownSeconds * 1000) {
      return
    }

    this.lastAlertAt.set(key, now)

    const payload = this.buildAlertPayload(entry)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), this.alertTimeoutMs)

    try {
      const response = await fetch(this.alertWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      if (!response.ok) {
        console.error(
          JSON.stringify({
            event: 'alert_delivery_failed',
            status: response.status,
            webhookType: this.alertWebhookType,
          }),
        )
      }
    } catch {
      console.error(
        JSON.stringify({
          event: 'alert_delivery_error',
          webhookType: this.alertWebhookType,
        }),
      )
    } finally {
      clearTimeout(timeout)
    }
  }

  private buildAlertPayload(entry: Record<string, unknown>) {
    const normalized: AlertEntry = {
      source: 'autospace-api',
      severity: entry.statusCode === 429 ? 'warning' : 'critical',
      timestamp: new Date().toISOString(),
      ...entry,
      metadata: this.sanitizeMetadata(
        (entry.metadata as Record<string, unknown>) || {},
      ),
    }

    const summary = `[${String(normalized.severity).toUpperCase()}] ${String(
      normalized.event,
    )} ${String(normalized.method || '')} ${String(
      normalized.path || '',
    )} (${String(normalized.statusCode || '-')})`

    if (this.alertWebhookType === 'slack') {
      return {
        text: summary,
        blocks: [
          {
            type: 'section',
            text: { type: 'mrkdwn', text: `*Autospace API Alert*\n${summary}` },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `\`requestId\`: ${String(
                normalized.requestId || 'n/a',
              )}\n\`ip\`: ${String(normalized.ip || 'n/a')}`,
            },
          },
        ],
        metadata: normalized,
      }
    }

    if (this.alertWebhookType === 'discord') {
      return {
        content: summary,
        embeds: [
          {
            title: 'Autospace API Alert',
            description: summary,
            color: normalized.severity === 'warning' ? 16766720 : 15158332,
            timestamp: String(normalized.timestamp),
            fields: [
              {
                name: 'Request ID',
                value: String(normalized.requestId || 'n/a'),
                inline: true,
              },
              {
                name: 'IP',
                value: String(normalized.ip || 'n/a'),
                inline: true,
              },
            ],
          },
        ],
      }
    }

    return normalized
  }

  private sanitizeMetadata(metadata: Record<string, unknown>) {
    const sanitized = { ...metadata }

    for (const key of Object.keys(sanitized)) {
      if (
        this.sensitiveKeys.some((sensitiveKey) =>
          key.toLowerCase().includes(sensitiveKey.toLowerCase()),
        )
      ) {
        sanitized[key] = '[REDACTED]'
      }
    }

    return sanitized
  }

  async onModuleDestroy() {
    await this.redis?.quit()
    await this.fileLogger?.flush()
  }
}
