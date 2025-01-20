'use client'

// Third-party Imports
import classnames from 'classnames'

import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import { useSession } from '@/context/SessionContext'

// Component Imports
import NavToggle from './NavToggle'


const NavbarContent = () => {

  const { session } = useSession()

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
      </div>
      <div className='flex items-center'>
        <UserDropdown session={session} dashboard />
      </div>
    </div>
  )
}

export default NavbarContent
