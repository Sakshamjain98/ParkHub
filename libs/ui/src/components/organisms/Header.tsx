'use client'
import { BaseComponent, MenuItem, Role } from '@ParkHub/util/types'
import { Brand } from '../atoms/Brand'
import { Container } from '../atoms/Container'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { LogoutButton } from '../molecules/LogoutButton'
import { Button } from '../atoms/Button'
import { NavSidebar } from './NavSidebar'
import { Menus } from './Menus'
import { usePathname } from 'next/navigation'

export type IHeaderProps = {
  type?: Role
  menuItems: MenuItem[]
} & BaseComponent

export const Header = ({ type, menuItems }: IHeaderProps) => {
  const session = useSession()
  const uid = session?.data?.user?.uid
  const pathname = usePathname()

  const mobileLinkItems = [
    { label: 'Home', href: '/' },
    ...menuItems.filter(({ href }) => href !== '/').slice(0, 2),
  ]

  const mobileActions = mobileLinkItems

  const showMobileMenu = type !== 'admin'

  return (
    <header>
      <nav className="fixed z-40 top-0 w-full border-b border-gray-200 bg-white shadow-md">
        <Container className="relative flex items-center justify-between h-16 py-2 px-3 sm:px-4 md:px-1 gap-3 sm:gap-6 md:gap-8">
          <Link href="/" aria-label="Home" className="w-auto z-50">
            <Brand type={type} className="hidden h-10 sm:block" />
            <Brand type={type} shortForm className="block sm:hidden" />
          </Link>
          <div className="flex items-center gap-2">
            {uid ? (
              <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                <div className="mr-1 hidden lg:flex gap-2 text-sm sm:mr-4 md:mr-6 md:gap-3">
                  <Menus menuItems={menuItems} />
                </div>
                <div className={type === 'admin' ? 'block' : 'hidden lg:block'}>
                  <LogoutButton />
                </div>
              </div>
            ) : (
              <>
                <Link href="/register">
                  <Button variant="outlined" size="sm">
                    Register
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">Log in</Button>
                </Link>
              </>
            )}
          </div>
        </Container>
      </nav>
      <div className="h-16" />
      {uid ? (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-transparent lg:hidden">
          <Container className="px-3 pb-2 pt-1 sm:px-4">
            <div
              className={`grid gap-2 ${
                showMobileMenu ? 'grid-cols-4' : 'grid-cols-2'
              }`}
            >
              {mobileActions.slice(0, 3).map((action) => {
                const active =
                  pathname === action.href ||
                  (action.href !== '/' && pathname?.startsWith(action.href))

                return (
                  <Link
                    key={`${action.label}-${action.href}`}
                    href={action.href}
                    className={`rounded-full border px-2 py-1.5 text-center text-xs font-medium ${
                      active
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white/95 text-black shadow-sm backdrop-blur'
                    }`}
                  >
                    {action.label}
                  </Link>
                )
              })}

              {showMobileMenu ? (
                <NavSidebar
                  menuItems={menuItems}
                  buttonClassName="w-full rounded-full border border-gray-300 bg-white/95 px-2 py-1.5 text-xs font-medium shadow-sm backdrop-blur"
                  buttonContent="Menu"
                />
              ) : null}
            </div>
          </Container>
        </div>
      ) : null}
      {uid ? <div className="h-1 lg:hidden" /> : null}
    </header>
  )
}
