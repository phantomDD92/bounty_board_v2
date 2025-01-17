// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'

// Layout Imports
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Header from '@components/layout/horizontal/Header'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import ScrollToTop from '@core/components/scroll-to-top'

const Layout = async ({ children }: ChildrenType) => {

  return (
    <>
      <HorizontalLayout header={<Header />} footer={<HorizontalFooter />}>
        {children}
      </HorizontalLayout>
      <ScrollToTop className='mui-fixed'>
        <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
          <i className='ri-arrow-up-line' />
        </Button>
      </ScrollToTop>
    </>
  )
}

export default Layout
