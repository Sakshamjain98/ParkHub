'use client'
import { IconMenu2 } from '@tabler/icons-react'
import { Sidebar } from './Sidebar'
import { useDialogState } from '@ParkHub/util/hooks/dialog'
import { ReactNode } from 'react'

import { MenuItem } from '@ParkHub/util/types'
import { LogoutButton } from '../molecules/LogoutButton'
import { UserInfo } from '../molecules/UserInfo'
import { Menus } from './Menus'

export interface INavSidebarProps {
  menuItems: MenuItem[]
  buttonClassName?: string
  buttonContent?: ReactNode
}

export const NavSidebar = ({
  menuItems,
  buttonClassName = 'p-2 md:hidden',
  buttonContent,
}: INavSidebarProps) => {
  const [open, setOpen] = useDialogState()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className={buttonClassName}
        aria-label="Open main menu"
      >
        {buttonContent || <IconMenu2 className="w-5 h-5" />}
      </button>
      <Sidebar open={open} setOpen={setOpen}>
        <div className="flex flex-col items-start space-y-1">
          <UserInfo className="mb-4" />
          <Menus menuItems={menuItems} />
        </div>
        <div className=" mt-auto">
          <LogoutButton />
        </div>
      </Sidebar>
    </>
  )
}
