import { redirect } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'

// Layout Imports
import VerticalLayout from '@layouts/VerticalLayout'

// Component Imports
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import ScrollToTop from '@core/components/scroll-to-top'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import { getSession } from '@/lib/session'
import { Role } from '@/lib/models/User'



const Layout = async ({ children }: ChildrenType) => {

  // Vars
  const mode = getMode()
  const systemMode = getSystemMode()
  const session = await getSession()

  if (!session || !session.isAuth || session.role != Role.ADMIN) {
    redirect('/')
  }
  
  return (
    <>
      <VerticalLayout
        navigation={<Navigation mode={mode} systemMode={systemMode} />}
        navbar={<Navbar />}
        footer={<VerticalFooter />}
      >
        {children}
      </VerticalLayout>
      <ScrollToTop className='mui-fixed'>
        <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
          <i className='ri-arrow-up-line' />
        </Button>
      </ScrollToTop>
    </>
  )
}

export default Layout
