'use client'

import { getSession, loginSimulate, logoutUser, requestLogin, cancelLogin, checkLogin } from '@/lib/api'
import { createContext, useContext, useEffect, useState } from 'react'
import LoginDialog from '@/components/dialogs/LoginDialog'
import { toast } from 'react-toastify'

type Session = {
  isAuth: boolean
  name: string
  role: string
  iaddress: string
}

type SessionContextType = {
  session: Session | null
  testLogin: () => void
  logout: () => void
  login?: () => void
  // setSession: (session: Session) => void;
}

const SessionContext = createContext<SessionContextType | null>(null)

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [open, setOpen] = useState(false)
  const [qrData, setQrData] = useState('')
  const [loading, setLoading] = useState(false)
  const [challenge, setChallengeID] = useState<string | null>(null)

  let checkInterval: string | number | NodeJS.Timeout | undefined;

  useEffect(() => {
    getSession()
      .then(session => {
        setSession(session)
      })
      .catch(() => {
        setSession(null)
      })
  }, [])

  useEffect(() => {
    if (!open && checkInterval) {
      clearInterval(checkInterval)
      checkInterval = undefined;
    }
  }, [open])

  useEffect(() => {
    if (challenge) {
      checkInterval = setInterval(async () => {
        checkLogin(challenge)
          .then(success => {
            if (success) {
              getSession()
                .then(session => {
                  setSession(session)
                  clearInterval(checkInterval)
                  setOpen(false)
                })
                .catch(() => { 
                  toast.warning('Login Failed.')
                  clearInterval(checkInterval)
                  setOpen(false);
                })
            }
          })
          .catch(() => { })
      }, 10000)
      return () => {
        if (checkInterval) {
          clearInterval(checkInterval)
          checkInterval = undefined;
        }
      }
    }
  }, [challenge])

  const testLogin = async () => {
    loginSimulate()
      .then(() => {
        return getSession()
      })
      .then(session => {
        setSession(session)
      })
      .catch(error => {
        console.error(error)
      })
  }

  const login = async () => {
    setLoading(true)
    setOpen(true)
    // Using fetch to send the POST request

    requestLogin()
      .then((data: any) => {
        setLoading(false)
        setQrData(data.deepLink)
        setChallengeID(data.challengeID)
      })
      .catch((error: any) => {
        toast.error('Login Request Failed')
      })
  }

  const logout = async () => {
    logoutUser()
      .then(() => {
        setSession(null)
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleLoginCancel = () => {
    if (challenge) {
      cancelLogin(challenge)
        .then(() => {
          toast.success('Login Request Canceled')
          setOpen(false)
          setChallengeID(null)
        })
        .catch(() => {
          setOpen(false)
          setChallengeID(null)
        })
    }
  }

  return (
    <SessionContext.Provider value={{ session, testLogin, login, logout }}>
      <>{children}</>
      <LoginDialog open={open} onClose={handleLoginCancel} loading={loading} qrCode={qrData} />
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
