import { PrismaClient } from '@prisma/client'
import { garages } from './data'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const MIN_ENTRIES = 20
const DEFAULT_ADMIN_UID = 'admin-default'
const DEFAULT_ADMIN_EMAIL = 'admin@autospace.dev'
const DEFAULT_ADMIN_PASSWORD = 'Admin@12345678'

const makeUid = (prefix: string, index: number) => `${prefix}-${index + 1}`

async function clearDatabase() {
  await prisma.valetAssignment.deleteMany()
  await prisma.bookingTimeline.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.slot.deleteMany()
  await prisma.address.deleteMany()
  await prisma.garage.deleteMany()

  await prisma.valet.deleteMany()
  await prisma.manager.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.authProvider.deleteMany()
  await prisma.credentials.deleteMany()
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()
}

async function seedCompanies() {
  await prisma.company.createMany({
    data: Array.from({ length: MIN_ENTRIES }, (_, index) => ({
      displayName: `ParkHub Company ${index + 1}`,
      description: `Seeded company ${index + 1}`,
    })),
  })

  return prisma.company.findMany({ orderBy: { id: 'asc' } })
}

async function seedGarages(companyIds: number[]) {
  for (const [index, garage] of garages.entries()) {
    const companyId = companyIds[index % companyIds.length]

    await prisma.garage.create({
      data: {
        ...garage,
        Company: {
          connect: { id: companyId },
        },
      },
    })
  }

  return prisma.garage.findMany({ orderBy: { id: 'asc' } })
}

async function seedRoleUsers(companyIds: number[]) {
  const adminUids = Array.from({ length: MIN_ENTRIES }, (_, i) =>
    makeUid('admin', i),
  )
  const customerUids = Array.from({ length: MIN_ENTRIES }, (_, i) =>
    makeUid('customer', i),
  )
  const managerUids = Array.from({ length: MIN_ENTRIES }, (_, i) =>
    makeUid('manager', i),
  )
  const valetUids = Array.from({ length: MIN_ENTRIES }, (_, i) =>
    makeUid('valet', i),
  )

  const allUsers = [...adminUids, ...customerUids, ...managerUids, ...valetUids]

  await prisma.user.createMany({
    data: allUsers.map((uid) => ({
      uid,
      name: uid,
      image: null,
    })),
  })

  await prisma.credentials.createMany({
    data: allUsers.map((uid, index) => ({
      uid,
      email: `${uid}@seed.ParkHub.dev`,
      passwordHash: `seed-hash-${index + 1}`,
    })),
  })

  await prisma.authProvider.createMany({
    data: allUsers.map((uid) => ({
      uid,
      type: 'CREDENTIALS',
    })),
  })

  await prisma.admin.createMany({
    data: adminUids.map((uid) => ({ uid })),
  })

  await prisma.customer.createMany({
    data: customerUids.map((uid, index) => ({
      uid,
      displayName: `Customer ${index + 1}`,
    })),
  })

  await prisma.manager.createMany({
    data: managerUids.map((uid, index) => ({
      uid,
      displayName: `Manager ${index + 1}`,
      companyId: companyIds[index],
    })),
  })

  await prisma.valet.createMany({
    data: valetUids.map((uid, index) => ({
      uid,
      displayName: `Valet ${index + 1}`,
      image: null,
      licenceID: `LIC-${(index + 1).toString().padStart(4, '0')}`,
      companyId: companyIds[index % companyIds.length],
    })),
  })

  return { adminUids, customerUids, managerUids, valetUids }
}

async function seedDefaultAdmin() {
  const passwordHash = bcrypt.hashSync(
    DEFAULT_ADMIN_PASSWORD,
    bcrypt.genSaltSync(),
  )

  await prisma.user.create({
    data: {
      uid: DEFAULT_ADMIN_UID,
      name: 'Default Admin',
      image: null,
      Credentials: {
        create: {
          email: DEFAULT_ADMIN_EMAIL,
          passwordHash,
        },
      },
      AuthProvider: {
        create: {
          type: 'CREDENTIALS',
        },
      },
      Admin: {
        create: {},
      },
    },
  })
}

async function seedTransactionalData(input: {
  adminUids: string[]
  customerUids: string[]
  managerUids: string[]
  valetUids: string[]
  garages: { id: number }[]
}) {
  const slots = await prisma.slot.findMany({
    orderBy: { id: 'asc' },
    take: MIN_ENTRIES,
  })

  for (let index = 0; index < MIN_ENTRIES; index++) {
    const startTime = new Date(Date.now() + index * 60 * 60 * 1000)
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000)

    const booking = await prisma.booking.create({
      data: {
        pricePerHour: 10 + index,
        totalPrice: 20 + index,
        startTime,
        endTime,
        vehicleNumber: `NY-${String(index + 1).padStart(4, '0')}`,
        phoneNumber: `+10000000${String(index + 1).padStart(3, '0')}`,
        passcode: String(1000 + index),
        status: 'BOOKED',
        Slot: { connect: { id: slots[index].id } },
        Customer: { connect: { uid: input.customerUids[index] } },
      },
    })

    await prisma.bookingTimeline.create({
      data: {
        status: 'BOOKED',
        bookingId: booking.id,
        managerId: input.managerUids[index],
      },
    })

    await prisma.valetAssignment.create({
      data: {
        bookingId: booking.id,
        pickupLat: 40.7 + index * 0.001,
        pickupLng: -74.0 - index * 0.001,
        returnLat: 40.71 + index * 0.001,
        returnLng: -74.01 - index * 0.001,
        pickupValetId: input.valetUids[index],
        returnValetId: input.valetUids[(index + 1) % input.valetUids.length],
      },
    })

    await prisma.review.create({
      data: {
        rating: (index % 5) + 1,
        comment: `Seed review ${index + 1}`,
        customerId: input.customerUids[index],
        garageId: input.garages[index % input.garages.length].id,
      },
    })

    await prisma.verification.create({
      data: {
        verified: index % 2 === 0,
        adminId: input.adminUids[index],
        garageId: input.garages[index].id,
      },
    })
  }
}

async function main() {
  await clearDatabase()

  const companies = await seedCompanies()
  const companyIds = companies.map((company) => company.id)

  const seededGarages = await seedGarages(companyIds)
  const roleUsers = await seedRoleUsers(companyIds)
  await seedDefaultAdmin()

  await seedTransactionalData({
    ...roleUsers,
    garages: seededGarages,
  })

  console.log('Default admin seeded')
  console.log(`email: ${DEFAULT_ADMIN_EMAIL}`)
  console.log(`password: ${DEFAULT_ADMIN_PASSWORD}`)
}

main()
  .catch((error) => {
    throw error
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
