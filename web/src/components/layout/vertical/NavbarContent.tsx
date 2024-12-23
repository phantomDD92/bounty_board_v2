'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import UserDropdown from '@components/layout/shared/UserDropdown'
// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { useSession } from '@/context/SessionContext'
import { useRouter } from 'next/router'


const NavbarContent = () => {
  const router = useRouter();
  const { session, logout } = useSession()
  const handleLogout = async () => {
    if (logout) await logout();
    router.reload()
  }

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
      </div>
      <div className='flex items-center'>
        <UserDropdown name={session?.name} admin onLogout={handleLogout}/>
      </div>
    </div>
  )
}

export default NavbarContent
