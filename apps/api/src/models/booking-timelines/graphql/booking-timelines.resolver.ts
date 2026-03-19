import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { BookingTimelinesService } from './booking-timelines.service'
import { BookingTimeline } from './entity/booking-timeline.entity'
import {
  FindManyBookingTimelineArgs,
  FindUniqueBookingTimelineArgs,
} from './dtos/find.args'
import { CreateBookingTimelineInput } from './dtos/create-booking-timeline.input'
import { UpdateBookingTimelineInput } from './dtos/update-booking-timeline.input'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'

@Resolver(() => BookingTimeline)
export class BookingTimelinesResolver {
  constructor(
    private readonly bookingTimelinesService: BookingTimelinesService,
    private readonly prisma: PrismaService,
  ) {}

  @AllowAuthenticated('admin', 'manager')
  @Mutation(() => BookingTimeline, {
    description: 'Create a booking timeline entry and update booking status.',
  })
  async createBookingTimeline(
    @Args('createBookingTimelineInput')
    { bookingId, status }: CreateBookingTimelineInput,
    @GetUser() user: GetUserType,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        Slot: {
          select: {
            Garage: {
              select: {
                Company: {
                  select: { Managers: { select: { uid: true } } },
                },
              },
            },
          },
        },
      },
    })
    checkRowLevelPermission(
      user,
      booking.Slot.Garage.Company.Managers.map((manager) => manager.uid),
    )

    const [updatedBooking, bookingTimeline] = await this.prisma.$transaction([
      this.prisma.booking.update({
        data: { status: status },
        where: { id: bookingId },
      }),
      this.prisma.bookingTimeline.create({
        data: { bookingId, managerId: user.uid, status },
      }),
    ])
    return bookingTimeline
  }

  @AllowAuthenticated('admin', 'manager')
  @Query(() => [BookingTimeline], {
    name: 'bookingTimelines',
    description: 'List booking timeline events with optional filtering.',
  })
  findAll(@Args() args: FindManyBookingTimelineArgs) {
    return this.bookingTimelinesService.findAll(args)
  }

  @AllowAuthenticated('admin', 'manager')
  @Query(() => BookingTimeline, {
    name: 'bookingTimeline',
    description: 'Get a single booking timeline event by unique criteria.',
  })
  findOne(@Args() args: FindUniqueBookingTimelineArgs) {
    return this.bookingTimelinesService.findOne(args)
  }

  @AllowAuthenticated('admin')
  @Mutation(() => BookingTimeline, { description: 'Update an existing booking timeline event.' })
  async updateBookingTimeline(
    @Args('updateBookingTimelineInput') args: UpdateBookingTimelineInput,
  ) {
    return this.bookingTimelinesService.update(args)
  }

  @AllowAuthenticated('admin')
  @Mutation(() => BookingTimeline, { description: 'Delete an existing booking timeline event.' })
  async removeBookingTimeline(@Args() args: FindUniqueBookingTimelineArgs) {
    return this.bookingTimelinesService.remove(args)
  }
}
