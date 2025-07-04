
// Type Imports
import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'

import ThemeProvider from '@components/theme'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
import { SettingsProvider } from '@core/contexts/settingsContext'

import { SessionProvider } from '@/context/SessionContext'


import AppReactToastify from '@/lib/styles/AppReactToastify'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const systemMode = getSystemMode()

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ThemeProvider direction={direction} systemMode={systemMode}>
          {/* <Provider store={store}> */}
            {/* <PersistGate loading={null} persistor={persistor}> */}
              <SessionProvider>{children}</SessionProvider>
              {/* {children} */}
            {/* </PersistGate> */}
          {/* </Provider> */}
          <AppReactToastify direction={direction} hideProgressBar />
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default Providers
