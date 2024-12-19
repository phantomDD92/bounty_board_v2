'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import { Button } from '@mui/material'
// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { loginUser } from '@/lib/api'

const handleLogin = async () => {
  await loginUser("", "");
}

const NavbarContent = () => {
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <ModeDropdown />
      </div>
      <div className='flex items-center'>
        {/* <UserDropdown /> */}
        <Button onClick={handleLogin}>Login</Button>
      </div>
    </div>
  )
}

export default NavbarContent
