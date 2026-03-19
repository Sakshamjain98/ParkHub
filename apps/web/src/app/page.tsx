'use client'
import { CarScene } from '@ParkHub/3d/src/scenes/CarScene'
import { Dialog } from '@ParkHub/ui/src/components/atoms/Dialog'
import {
  IconCode,
  IconHierarchy2,
  IconInfoCircle,
  IconSearch,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'

type InfoKey = 'search' | 'about' | 'architecture' | 'tech'

const MODAL_CONTENT: Record<
  InfoKey,
  {
    title: string
    points: string[]
  }
> = {
  search: {
    title: 'Search now',
    points: [
      'Use Search to discover garages, live slot availability, and booking-ready options.',
      'The web app connects to GraphQL via @ParkHub/network and renders booking/search flows from @ParkHub/ui + @ParkHub/forms.',
      'Open the search page to filter options and book a slot end-to-end.',
    ],
  },
  about: {
    title: 'About the project',
    points: [
      'ParkHub is a monorepo managed with Nx + Yarn workspaces across apps (web, api, admin/manager/valet) and shared libs.',
      'Backend is a NestJS API with GraphQL, Prisma, Redis, Stripe support, and typed entities/codegen workflows.',
      'Frontend apps are Next.js 14 projects that reuse a shared UI system and shared form/network/util packages.',
    ],
  },
  architecture: {
    title: 'Project architecture',
    points: [
      'Client apps -> shared network lib (@apollo/client + generated GraphQL docs) -> NestJS GraphQL API.',
      'API layer -> Prisma ORM -> PostgreSQL for persistent data; Redis is available for cache/session-oriented workloads.',
      'Infra includes Nginx edge proxy with request limits, user-agent/URI blocking, and structured access logs.',
    ],
  },
  tech: {
    title: 'Tech stack, team, scalability & deployment',
    points: [
      'Stack: TypeScript end-to-end, Next.js, NestJS, GraphQL, Prisma, PostgreSQL, Redis, Stripe, Tailwind, Headless UI, Tabler Icons.',
      'Developer workflow: Nx targets for tsc/lint/build, shared libs for UI/forms/network/util, and GraphQL codegen for type safety.',
      'Scalability & deployment readiness: Docker services (db/redis/edge proxy), reverse proxy limits/timeouts, logrotate policy, and modular app separation for team ownership.',
    ],
  },
}

const INFO_BUTTONS: {
  id: InfoKey
  label: string
  Icon: typeof IconSearch
}[] = [
  { id: 'search', label: 'Search now', Icon: IconSearch },
  { id: 'about', label: 'About project', Icon: IconInfoCircle },
  { id: 'architecture', label: 'Architecture', Icon: IconHierarchy2 },
  { id: 'tech', label: 'Tech & scale', Icon: IconCode },
]

export default function Home() {
  const [activeModal, setActiveModal] = useState<InfoKey | null>(null)

  return (
    <main className="fixed inset-x-0 bottom-0 top-16 z-0 overflow-hidden">
      <div className="absolute inset-0">
        <CarScene />
      </div>

      <div className="fixed left-0 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2">
        {INFO_BUTTONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveModal(id)}
            className="glass-panel flex w-44 items-center gap-3 rounded-l-none rounded-r-full border-l-0 px-3 py-2 text-black"
            aria-label={label}
          >
            <span className="glass-icon inline-flex h-9 w-9 items-center justify-center rounded-xl">
              <Icon size={18} />
            </span>
            <span className="whitespace-nowrap text-sm font-medium">
              {label}
            </span>
          </button>
        ))}
      </div>

      <Dialog
        open={Boolean(activeModal)}
        setOpen={(open) => {
          if (!open) setActiveModal(null)
        }}
        title={activeModal ? MODAL_CONTENT[activeModal].title : ''}
        widthClassName="max-w-2xl"
      >
        {activeModal ? (
          <div className="space-y-3 text-sm text-gray-700">
            {MODAL_CONTENT[activeModal].points.map((point) => (
              <p key={point} className="glass-panel p-3 leading-relaxed">
                {point}
              </p>
            ))}
            {activeModal === 'search' ? (
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-black transition hover:bg-primary-600"
              >
                <IconSearch size={18} /> Open search page
              </Link>
            ) : null}
          </div>
        ) : null}
      </Dialog>
    </main>
  )
}
