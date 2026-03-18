import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { randomUUID } from 'crypto'
import { existsSync } from 'fs'
import { execSync } from 'child_process'
import { StructuredLoggerService } from './common/logging/structured-logger.service'
import { ValidationPipe } from '@nestjs/common'
import { json, urlencoded } from 'express'
const port = process.env.PORT || 3000
const LOGROTATE_SELF_CHECK =
  String(process.env.LOGROTATE_SELF_CHECK || 'true').toLowerCase() !== 'false'
const LOGROTATE_BINARY = process.env.LOGROTATE_BINARY || 'logrotate'
const LOGROTATE_CONFIG_PATH =
  process.env.LOGROTATE_CONFIG_PATH || '/etc/logrotate.d/autospace-api'

const LOGROTATE_BINARY_CANDIDATES = [
  LOGROTATE_BINARY,
  '/opt/homebrew/opt/logrotate/sbin/logrotate',
  '/usr/local/opt/logrotate/sbin/logrotate',
]

const LOGROTATE_CONFIG_CANDIDATES = [
  LOGROTATE_CONFIG_PATH,
  '/opt/homebrew/etc/logrotate.d/autospace-api',
  '/usr/local/etc/logrotate.d/autospace-api',
]

const resolveExistingPath = (candidates: string[]) => {
  for (const candidate of candidates) {
    if (!candidate) {
      continue
    }
    if (existsSync(candidate)) {
      return candidate
    }
  }
  return candidates[0]
}

const runLogrotateSelfCheck = async (logger: StructuredLoggerService) => {
  if (!LOGROTATE_SELF_CHECK) {
    return
  }

  const resolvedBinary = resolveExistingPath(LOGROTATE_BINARY_CANDIDATES)
  const resolvedConfig = resolveExistingPath(LOGROTATE_CONFIG_CANDIDATES)

  try {
    execSync(`${resolvedBinary} --version`, { stdio: 'ignore' })
  } catch {
    await logger.log({
      level: 'warn',
      event: 'startup_logrotate_check',
      message: `logrotate binary not found (${resolvedBinary})`,
      metadata: {
        logrotateBinary: resolvedBinary,
      },
    })
    return
  }

  if (!existsSync(resolvedConfig)) {
    await logger.log({
      level: 'warn',
      event: 'startup_logrotate_check',
      message: `logrotate config not found (${resolvedConfig})`,
      metadata: {
        logrotateConfigPath: resolvedConfig,
      },
    })
    return
  }

  await logger.log({
    level: 'info',
    event: 'startup_logrotate_check',
    message: 'logrotate binary and config detected',
    metadata: {
      logrotateBinary: resolvedBinary,
      logrotateConfigPath: resolvedConfig,
    },
  })
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = app.get(StructuredLoggerService)
  const bodyLimit = process.env.REQUEST_BODY_LIMIT || '1mb'

  await runLogrotateSelfCheck(logger)

  app.enableShutdownHooks()
  app.use(json({ limit: bodyLimit }))
  app.use(urlencoded({ extended: true, limit: bodyLimit }))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  app.getHttpAdapter().getInstance().set('trust proxy', 1)
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }),
  )

  const corsOrigins = (
    process.env.CORS_ORIGINS ||
    'http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004'
  )
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  })

  app.use((req: any, res: any, next: () => void) => {
    const startTime = Date.now()
    const requestId = req.headers['x-request-id'] || randomUUID()
    res.setHeader('x-request-id', requestId)

    const finalize = async () => {
      const durationMs = Date.now() - startTime
      const level =
        res.statusCode >= 500
          ? 'error'
          : res.statusCode >= 400
          ? 'warn'
          : 'info'

      await logger.log({
        level,
        event: 'http_request',
        message: `${req.method} ${req.originalUrl || req.url}`,
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode: res.statusCode,
        durationMs,
        ip: req.ip,
        requestId,
        metadata: {
          userAgent: req.headers['user-agent'] || 'unknown',
        },
      })
    }

    res.on('finish', () => {
      void finalize()
    })

    next()
  })

  const config = new DocumentBuilder()
    .setTitle('Autospace | Saksham Jain')
    .setDescription(
      `The Autospace API.
<h2>Looking for the graphql api?</h2>
Go to <a href="/graphql" target="_blank">/graphql</a>.
Or,
You might also need to use the <a target="_blank" href="https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:3000/graphql&document=query users{users{ uid }}
">Apollo explorer</a> for a greater experience.

      `,
    )
    .setVersion('0.1')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/', app, document)

  await app.listen(port, '0.0.0.0')
}
bootstrap()
