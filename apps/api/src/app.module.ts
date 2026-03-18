import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './common/prisma/prisma.module'
import { UsersModule } from './models/users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { AdminsModule } from './models/admins/admins.module'
import { CustomersModule } from './models/customers/customers.module'
import { ManagersModule } from './models/managers/managers.module'
import { ValetsModule } from './models/valets/valets.module'
import { CompaniesModule } from './models/companies/companies.module'
import { GaragesModule } from './models/garages/garages.module'
import { AddressesModule } from './models/addresses/addresses.module'
import { SlotsModule } from './models/slots/slots.module'
import { BookingsModule } from './models/bookings/bookings.module'
import { ValetAssignmentsModule } from './models/valet-assignments/valet-assignments.module'
import { BookingTimelinesModule } from './models/booking-timelines/booking-timelines.module'
import { ReviewsModule } from './models/reviews/reviews.module'
import { VerificationsModule } from './models/verifications/verifications.module'
import { StripeModule } from './models/stripe/stripe.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { GqlThrottlerGuard } from './common/throttler/gql-throttler.guard'
import { jwtSecrets } from './common/auth/jwt-secrets'
import { RedisThrottlerStorage } from './common/throttler/redis-throttler.storage'
import { StructuredLoggerService } from './common/logging/structured-logger.service'

// Todo: Move this to util lib.
const MAX_AGE = 24 * 60 * 60
const RATE_LIMIT_TTL_SECONDS = Number(process.env.RATE_LIMIT_TTL_SECONDS || 60)
const RATE_LIMIT_MAX_REQUESTS = Number(
  process.env.RATE_LIMIT_MAX_REQUESTS || 120,
)
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const ENABLE_GRAPHQL_INTROSPECTION =
  String(
    process.env.ENABLE_GRAPHQL_INTROSPECTION || (!IS_PRODUCTION).toString(),
  ) === 'true'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: RATE_LIMIT_TTL_SECONDS,
      limit: RATE_LIMIT_MAX_REQUESTS,
      storage: new RedisThrottlerStorage(REDIS_URL),
    }),
    JwtModule.register({
      global: true,
      secret: jwtSecrets.current,
      signOptions: { expiresIn: MAX_AGE },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: ENABLE_GRAPHQL_INTROSPECTION,
      csrfPrevention: true,
      fieldResolverEnhancers: ['guards'],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      //   buildSchemaOptions: {
      //      numberScalarMode: 'integer',
      //   },
    }),

    PrismaModule,

    StripeModule,

    UsersModule,
    AdminsModule,
    CustomersModule,
    ManagersModule,
    ValetsModule,
    CompaniesModule,
    GaragesModule,
    AddressesModule,
    SlotsModule,
    BookingsModule,
    ValetAssignmentsModule,
    BookingTimelinesModule,
    ReviewsModule,
    VerificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    StructuredLoggerService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
