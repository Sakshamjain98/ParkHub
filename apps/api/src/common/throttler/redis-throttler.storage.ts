import { Logger } from '@nestjs/common'
import { ThrottlerStorage } from '@nestjs/throttler'
import Redis from 'ioredis'

const RATE_LIMIT_KEY_PREFIX = 'throttle'

export class RedisThrottlerStorage implements ThrottlerStorage {
  storage: Record<string, { totalHits: number; expiresAt: number }> = {}

  private readonly logger = new Logger(RedisThrottlerStorage.name)
  private readonly redis: Redis

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    })

    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis for distributed rate limiting')
    })

    this.redis.on('error', (error) => {
      this.logger.error('Redis throttler storage error', error)
    })
  }

  async increment(key: string, ttl: number) {
    const throttlerKey = `${RATE_LIMIT_KEY_PREFIX}:${key}`

    const [totalHits, timeToExpire] = (await this.redis
      .multi()
      .incr(throttlerKey)
      .expire(throttlerKey, ttl, 'NX')
      .ttl(throttlerKey)
      .exec()) as [
      [Error | null, number],
      [Error | null, number],
      [Error | null, number],
    ]

    if (totalHits?.[0]) {
      throw totalHits[0]
    }

    if (timeToExpire?.[0]) {
      throw timeToExpire[0]
    }

    return {
      totalHits: totalHits?.[1] || 0,
      timeToExpire: Math.max(0, timeToExpire?.[1] || 0),
    }
  }
}
