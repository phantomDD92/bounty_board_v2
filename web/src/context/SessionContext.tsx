'use client'

import { getSession, loginSimulate, logoutUser } from '@/lib/api'
import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

type Session = {
  isAuth: boolean,
  name: string,
  role: string,
  iaddress: string,
}

type SessionContextType = {
  session: Session | null
  testLogin: () => void,
  logout: () => void,
  // setSession: (session: Session) => void;
}

const SessionContext = createContext<SessionContextType | null>(null)

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  useEffect(() => {
    getSession()
      .then(session => {
        setSession(session)
      })
      .catch(() => {
        setSession(null);
      })
  }, [])

  const testLogin = async () => {
    loginSimulate()
      .then(() => {
        return getSession()
      })
      .then((session) => {
        setSession(session)
      })
      .catch(error => {
        console.error(error)
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
  return <SessionContext.Provider value={{ session, testLogin, logout }}>{children}</SessionContext.Provider>
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
