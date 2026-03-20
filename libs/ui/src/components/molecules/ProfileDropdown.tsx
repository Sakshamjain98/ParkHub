'use client'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { IconLogout, IconChevronDown, IconUser } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItem } from '@ParkHub/util/types'

export const ProfileDropdown = ({
  menuItems,
}: {
  menuItems: MenuItem[]
}) => {
  const session = useSession()
  const [open, setOpen] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const pathname = usePathname()

  const user = session?.data?.user
  const name = user?.name || 'User'
  const uid = user?.uid
  const email = user?.email

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`group flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${
          open
            ? 'border-gray-300 bg-white shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gray-700 to-black text-xs font-semibold text-white ring-1 ring-black/5">
          {!avatarError && user.image ? (
            <Image
              src={user.image}
              alt={name}
              width={28}
              height={28}
              className="w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : name ? (
            <span>{name?.charAt(0).toUpperCase()}</span>
          ) : (
            <IconUser className="w-4 h-4" />
          )}
        </div>
        <div className="hidden sm:flex max-w-[140px] flex-col items-start gap-0 leading-tight">
          <span className="truncate text-xs font-semibold text-gray-900">{name}</span>
          <span className="truncate text-[10px] text-gray-500">{uid}</span>
        </div>
        <IconChevronDown
          className={`h-4 w-4 transition-all ${
            open
              ? 'rotate-180 text-gray-700'
              : 'text-gray-500 group-hover:text-gray-700'
          }`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 z-40 mt-2 w-[18rem] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-80">
            {/* User Info Section */}
            <div className="border-b border-gray-100 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-black text-lg font-semibold text-white ring-1 ring-black/5">
                  {!avatarError && user.image ? (
                    <Image
                      src={user.image}
                      alt={name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : name ? (
                    <span>{name?.charAt(0).toUpperCase()}</span>
                  ) : (
                    <IconUser className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{name}</p>
                  {email && (
                    <p className="text-xs text-gray-600 truncate">{email}</p>
                  )}
                  {uid && (
                    <p className="text-xs text-gray-500 font-mono mt-1">{uid}</p>
                  )}
                </div>
              </div>
            </div>

            {menuItems.length > 0 ? (
              <div className="border-b border-gray-100 bg-white p-2">
                <div className="mb-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Navigation
                </div>
                <div className="space-y-1">
                  {menuItems.map(({ label, href }) => {
                    const active =
                      pathname === href ||
                      (href !== '/' && pathname?.startsWith(href))

                    return (
                      <Link
                        key={`${label}-${href}`}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                          active
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                        }`}
                      >
                        {label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Actions Section */}
            <div className="bg-white p-2">
              <button
                onClick={() => {
                  setOpen(false)
                  signOut({ callbackUrl: '/login' })
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
              >
                <IconLogout className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
