'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Router from 'next/router'
// import { jwtDecode, JwtPayload } from 'jwt-decode'
import LoginDialog from '@/components/dialogs/LoginDialog'
import { SessionType } from '@/types/valueTypes'
import axios from 'axios'
// import { getUser } from '@/lib/api'

interface AuthContextType {
  login?: () => Promise<void>
  testLogin?: () => Promise<void>
  logout?: () => void
  session?: SessionType
  token?: string
}

// interface User extends JwtPayload {
//   name: string
//   iaddress: string
// }

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>()
  const [session, setSession] = useState<SessionType | undefined>()
  const [QRData, setQRData] = useState('')
  const [qrOpen, setQrOpen] = useState(false)
  const [challengeID, setChallengeID] = useState(false)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    setToken(localStorage.getItem('token') || undefined)
  }, [])

  useEffect(() => {
    if (token) {
      axios
        .get('/api/auth', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          const { user } = response.data
          console.log('### : ', user)
          setSession({ ...user, isLogged: true })
        })
        .catch(error => {
          console.error('Get me failed :', error)
          setToken(undefined)
          localStorage.removeItem('token')
        })
    }
  }, [token])

  const testLogin = async () => {
    setLoading(true)
    axios
      .post('/api/auth', { iaddress: 'iKX5wGESZQFRQzhTV7dYGdsXq2o3uwyTd1', name: 'CCC.bitcoins@' })
      .then(response => {
        const { token } = response.data
        setToken(token)
        localStorage.setItem('token', token)
        setLoading(false);
        Router.reload();
      })
      .catch(error => {
        console.error('Login failed:', error)
      })
  }

  const login = async () => {
    try {
      setLoading(true)
      setQrOpen(true)
      // Using fetch to send the POST request
      const response = await fetch(`${process.env.NEXT_PUBLIC_VERUS_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache'
      })
      // Check if the response is successful (status in range 200-299)
      if (!response.ok) {
        throw new Error(`Http error! Status: ${response.status}`)
      }
      // Parse the response JSON
      const { data } = await response.json()
      if (data) {
        setLoading(false)
        setQRData(data.deepLink)
        setChallengeID(data.challengeID)
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = (): void => {
    setToken(undefined)
    localStorage.removeItem('token')
  }

  // useEffect(() => {
  //   if (challengeID) {
  //     const socket = new WebSocket(`${process.env.NEXT_PUBLIC_VERUS_WEBSOCKET}/awaitlogin/` + challengeID)
  //     socket.onopen = () => {
  //       console.log('WebSocket connection established')
  //     }
  //     socket.onmessage = event => {
  //       const receivedMessage = JSON.parse(event.data)
  //       setToken(receivedMessage.access)
  //       localStorage.setItem('token', receivedMessage.access)
  //       setQrOpen(false)
  //     }
  //     return () => {
  //       socket.close()
  //     }
  //   }
  // }, [challengeID])

  return (
    <AuthContext.Provider value={{ login, logout, session, testLogin, token }}>
      <>{children}</>
      <LoginDialog
        open={qrOpen}
        loading={loading}
        qrCode={QRData}
        onClose={() => {
          setQrOpen(false)
          setQRData('')
        }}
      />
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
