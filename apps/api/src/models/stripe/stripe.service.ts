import Stripe from 'stripe'

import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateStripeDto } from './dto/create-stripe-session.dto'
import { toTitleCase } from 'src/common/util'

@Injectable()
export default class StripeService {
  public stripe: Stripe
  private readonly webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    })
  }

  async createStripeSession({
    totalPriceObj,
    uid,
    bookingData,
  }: CreateStripeDto) {
    if (bookingData.customerId !== uid) {
      throw new BadRequestException(
        'Booking data customerId must match authenticated user.',
      )
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: Object.entries(totalPriceObj)
        .filter(([, price]) => price > 0)
        .map(([name, price]) => ({
          quantity: 1,
          price_data: {
            product_data: {
              name: toTitleCase(name),
            },
            currency: 'usd',
            unit_amount: price * 100,
          },
        })),
      mode: 'payment',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      client_reference_id: uid,
      metadata: {
        uid,
        bookingData: JSON.stringify(bookingData),
      },
    })

    return { sessionId: session.id }
  }

  constructWebhookEvent(payload: Buffer, signature?: string) {
    if (!signature) {
      throw new BadRequestException('Missing Stripe signature header.')
    }

    if (!this.webhookSecret) {
      throw new BadRequestException('Missing STRIPE_WEBHOOK_SECRET.')
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret,
      )
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature.')
    }
  }
}
