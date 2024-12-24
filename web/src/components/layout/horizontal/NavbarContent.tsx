'use client'

// Third-party Imports
import classnames from 'classnames'
// Component Imports
import NavToggle from './NavToggle'
import Logo from '@components/layout/shared/Logo'
// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'
// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import Button from '@mui/material/Button'
// import { useAuth } from '@/context/AuthContext'
import UserDropdown from '@components/layout/shared/UserDropdown'
import { useSession } from '@/context/SessionContext'

const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()
  const { testLogin, login, logout, session } = useSession()

  const handleLoginClick = async (e: any) => {
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
          <UserDropdown name={session?.name} onLogout={handleLogout} />
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
