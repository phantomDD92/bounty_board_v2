'use client'

// Third-party Imports
import classnames from 'classnames'

import Button from '@mui/material/Button'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

import UserDropdown from '@components/layout/shared/UserDropdown'
import Logo from '@components/layout/shared/Logo'

import { useSession } from '@/context/SessionContext'

// Component Imports
import NavToggle from './NavToggle'

const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  // const { login, logout, session } = useSession()
  const { testLogin, logout, session } = useSession()

  const handleLoginClick = async () => {
    if (testLogin) await testLogin()

      // if (login) await login();
  }

  const handleLogout = async () => {
    if (logout) await logout()
  }

  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && <Logo />}
      </div>
      <div className='flex items-center'>
        {session && session.isAuth ? (
          <UserDropdown onLogout={handleLogout} session={session} />
        ) : (
          <Button onClick={handleLoginClick} variant='contained'>
            Login
          </Button>
        )}
      </div>
    </div>
  )
}

export default NavbarContent
