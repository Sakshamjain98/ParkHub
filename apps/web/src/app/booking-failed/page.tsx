import Link from 'next/link'

export default function Page() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-xl rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Booking failed
          </h1>
          <p className="text-sm text-gray-600">
            We could not complete your booking. Please verify your details and
            try again.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </Link>
          <Link
            href="/bookings"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black"
          >
            View bookings
          </Link>
        </div>
      </div>
    </main>
  )
}
