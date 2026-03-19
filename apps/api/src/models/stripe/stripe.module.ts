import { Module } from '@nestjs/common'

import { StripeController } from './stripe.controller'
import StripeService from './stripe.service'
import { BookingsModule } from '../bookings/bookings.module'

@Module({
  imports: [BookingsModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
