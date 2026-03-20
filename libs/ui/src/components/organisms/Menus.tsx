 'use client'
import { MenuItem } from '@ParkHub/util/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface IMenuItemProps {
  menuItems: MenuItem[]
}

export const Menus = ({ menuItems }: IMenuItemProps) => {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-6">
      {menuItems.map(({ label, href }) => (
        <Link
          className={`text-sm font-medium underline-offset-8 transition-colors ${
            pathname === href || (href !== '/' && pathname?.startsWith(href))
              ? 'text-black underline'
              : 'text-gray-700 hover:text-black hover:underline'
          }`}
          key={label}
          href={href}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
