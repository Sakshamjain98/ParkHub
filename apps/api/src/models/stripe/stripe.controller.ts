import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  Get,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import StripeService from './stripe.service'
import { BookingsService } from '../bookings/graphql/bookings.service'
import { CreateStripeDto } from './dto/create-stripe-session.dto'
import { CreateBookingInput } from '../bookings/graphql/dtos/create-booking.input'
import { Request, Response } from 'express'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import Stripe from 'stripe'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

class StripeSessionResponseDto {
  @ApiProperty({ example: 'cs_test_a1b2c3d4e5f6' })
  sessionId: string
}

class StripeWebhookAckDto {
  @ApiProperty({ example: true })
  received: boolean

  @ApiProperty({ required: false, example: true })
  ignored?: boolean

  @ApiProperty({ required: false, example: true })
  duplicate?: boolean
}

class StripeSuccessResponseDto {
  @ApiProperty({ example: true })
  received: boolean

  @ApiProperty({ required: false, example: true })
  ignored?: boolean

  @ApiProperty({ required: false, example: true })
  duplicate?: boolean
}

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly bookingService: BookingsService,
  ) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Stripe module health check for authenticated users' })
  @ApiOkResponse({
    description: 'Stripe module is reachable.',
    schema: { type: 'string', example: 'Hello Stripe' },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @Get()
  helloStripe() {
    return 'Hello Stripe'
  }

  @Post()
  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe Checkout session' })
  @ApiBody({
    type: CreateStripeDto,
    description:
      'Checkout payload for the authenticated user. uid and bookingData.customerId must match the token user.',
  })
  @ApiOkResponse({
    description: 'Checkout session created successfully.',
    type: StripeSessionResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @ApiForbiddenResponse({
    description: 'Authenticated user does not match payload ownership.',
  })
  @ApiBadRequestResponse({ description: 'Invalid checkout payload.' })
  create(
    @Body() createStripeDto: CreateStripeDto,
    @GetUser() user: GetUserType,
  ) {
    if (createStripeDto.uid !== user.uid) {
      throw new ForbiddenException('You can only create a session for yourself.')
    }

    if (createStripeDto.bookingData?.customerId !== user.uid) {
      throw new ForbiddenException('Invalid booking owner in session request.')
    }

    return this.stripeService.createStripeSession(createStripeDto)
  }

  private parseBookingInputFromSession(session: Stripe.Checkout.Session) {
    const { uid, bookingData } = session.metadata || {}
    if (!uid || !bookingData) {
      throw new BadRequestException('Missing booking metadata in session.')
    }

    const bookingInput: CreateBookingInput = JSON.parse(bookingData)
    if (bookingInput.customerId !== uid) {
      throw new BadRequestException('Booking metadata validation failed.')
    }

    return bookingInput
  }

  private async persistBookingFromSession(session: Stripe.Checkout.Session) {
    if (session.payment_status !== 'paid') {
      return { received: true, ignored: true }
    }

    const bookingInput = this.parseBookingInputFromSession(session)

    const existingBooking = await this.bookingService.findAll({
      where: {
        customerId: { equals: bookingInput.customerId },
        vehicleNumber: { equals: bookingInput.vehicleNumber },
        startTime: { equals: new Date(bookingInput.startTime).toISOString() },
        endTime: { equals: new Date(bookingInput.endTime).toISOString() },
      },
      take: 1,
    })

    if (existingBooking.length > 0) {
      return { received: true, duplicate: true }
    }

    await this.bookingService.create(bookingInput)
    return { received: true }
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Stripe webhook receiver',
    description:
      'Receives Stripe events. Verifies stripe-signature using STRIPE_WEBHOOK_SECRET and creates booking on checkout.session.completed.',
  })
  @ApiHeader({
    name: 'stripe-signature',
    required: true,
    description: 'Stripe webhook signature header.',
  })
  @ApiOkResponse({
    description: 'Webhook acknowledged.',
    type: StripeWebhookAckDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid signature, payload, or webhook configuration.',
  })
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') stripeSignature?: string,
  ) {
    const payload = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(JSON.stringify(req.body || {}))

    const event = this.stripeService.constructWebhookEvent(
      payload,
      stripeSignature,
    )

    if (event.type !== 'checkout.session.completed') {
      return { received: true, ignored: true }
    }

    const session = event.data.object as Stripe.Checkout.Session

    return this.persistBookingFromSession(session)
  }

  @Get('success')
  @ApiOperation({
    summary: 'Stripe success redirect handler',
    description:
      'Validates Stripe session and redirects to BOOKINGS_REDIRECT_URL. Booking creation is handled by webhook.',
  })
  @ApiQuery({
    name: 'session_id',
    required: true,
    type: String,
    description: 'Stripe checkout session id from success redirect.',
  })
  @ApiOkResponse({
    description: 'Redirects user after successful session validation.',
    type: StripeSuccessResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Missing or invalid Stripe session id.' })
  async handleStripeSuccess(
    @Query('session_id') sessionId: string,
    @Res() res: Response,
  ) {
    if (!sessionId) {
      throw new BadRequestException('Session id missing.')
    }

    const session = await this.stripeService.stripe.checkout.sessions.retrieve(
      sessionId,
    )

    if (!session.id) {
      throw new BadRequestException('Invalid Stripe session.')
    }

    await this.persistBookingFromSession(session)

    res.redirect(process.env.BOOKINGS_REDIRECT_URL)
  }
}
