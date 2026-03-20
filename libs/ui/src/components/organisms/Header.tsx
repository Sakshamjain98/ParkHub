'use client'
import { BaseComponent, MenuItem, Role } from '@ParkHub/util/types'
import { Brand } from '../atoms/Brand'
import { Container } from '../atoms/Container'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '../atoms/Button'
import { Menus } from './Menus'
import { ProfileDropdown } from '../molecules/ProfileDropdown'
import { useQuery } from '@apollo/client'
import { MyCompanyDocument } from '@ParkHub/network/src/gql/generated'

export type IHeaderProps = {
  type?: Role
  menuItems: MenuItem[]
} & BaseComponent

export const Header = ({ type, menuItems }: IHeaderProps) => {
  const session = useSession()
  const uid = session?.data?.user?.uid
  const searchMenuItem = menuItems.find(({ href }) => href === '/search')
  const { data: myCompanyData } = useQuery(MyCompanyDocument, {
    skip: type !== 'manager' || !uid,
  })

  const company = myCompanyData?.myCompany

  return (
    <header>
      <nav className="fixed z-40 top-0 w-full border-b border-gray-200 bg-white shadow-sm">
        <Container className="relative flex items-center h-16 gap-3 px-3 py-2 sm:px-4 md:px-6">
          {/* Left: Logo */}
          <Link href="/" aria-label="Home" className="w-auto z-50 flex-shrink-0">
            <Brand type={type} className="hidden h-10 sm:block" />
            <Brand type={type} shortForm className="block sm:hidden" />
          </Link>

          {/* Center: Navigation Menu */}
          {uid ? (
            <div className="hidden md:flex flex-1 justify-center">
              <Menus menuItems={menuItems} />
            </div>
          ) : (
            <div className="hidden md:block flex-1" />
          )}

          {/* Right: User Actions */}
          <div className="ml-auto flex items-center gap-3 sm:gap-4 md:gap-5">
            {uid ? (
              <>
                {/* Company Info (Manager only) */}
                {type === 'manager' && company && (
                  <div className="hidden lg:flex flex-col leading-tight">
                    <span className="text-xs text-gray-500">Company</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {company.displayName || `#${company.id}`}
                    </span>
                  </div>
                )}
                {/* Profile Dropdown */}
                <ProfileDropdown menuItems={menuItems} />
              </>
            ) : (
              <>
                {!type && searchMenuItem ? (
                  <Link href={searchMenuItem.href}>
                    <Button variant="outlined" size="sm">
                      Search
                    </Button>
                  </Link>
                ) : null}
                {type !== 'admin' && (
                  <Link href="/register">
                    <Button variant="outlined" size="sm" className="hidden sm:flex">
                      Register
                    </Button>
                  </Link>
                )}
                <Link href="/login">
                  <Button size="sm">Log in</Button>
                </Link>
              </>
            )}
          </div>
        </Container>
      </nav>
      <div className="h-16" />
    </header>
  )
}
