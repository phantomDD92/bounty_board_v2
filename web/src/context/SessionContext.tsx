'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import { toast } from 'react-toastify'

import { getSession, loginSimulate, logoutUser, requestLogin, cancelLogin, checkLogin, checkVerus } from '@/lib/api'

import LoginDialog from '@/components/dialogs/LoginDialog'

import { SessionType } from '@/types/valueTypes'

type SessionContextType = {
  session?: SessionType
  testLogin: () => void
  logout: () => void
  login?: () => void
}

const SessionContext = createContext<SessionContextType | null>(null)

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<SessionType>()
  const [open, setOpen] = useState(false)
  const [qrData, setQrData] = useState('')
  const [loading, setLoading] = useState(false)
  const [challenge, setChallengeID] = useState<string | null>(null)

  let checkInterval: string | number | NodeJS.Timeout | undefined;

  useEffect(() => {
    checkVerus().then(() => { }).catch(() => { });
    getSession()
      .then(session => {
        setSession(session)
      })
      .catch(() => {
        setSession(undefined)
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
          .then(status => {
            console.log(status);

            if (status == "success") {
              console.log("##### 1")
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
            } else if (status == "cancel" || status == "error") {
              console.log("##### 2")
              toast.error('Login Request Canceled.')
              clearInterval(checkInterval)
              setOpen(false)
            }
          })
          .catch(() => {
            console.log("##### 3")
            toast.error('Login Request Failed.')
            clearInterval(checkInterval)
            setOpen(false);
          })
      }, 5000)

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
      .catch(() => {
        toast.error('Login Request Failed')
      })
  }

  const logout = async () => {
    logoutUser()
      .then(() => {
        setSession(undefined)
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
