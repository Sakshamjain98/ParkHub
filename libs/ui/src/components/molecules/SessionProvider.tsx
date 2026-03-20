'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const SESSION_SNAPSHOT_KEY = 'parkhub.session.snapshot'

const SessionSnapshotSync = () => {
  const { data, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && data?.user?.uid) {
      const snapshot = {
        uid: data.user.uid,
        email: data.user.email || null,
        name: data.user.name || null,
        syncedAt: Date.now(),
      }
      sessionStorage.setItem(SESSION_SNAPSHOT_KEY, JSON.stringify(snapshot))
      return
    }

    if (status === 'unauthenticated') {
      sessionStorage.removeItem(SESSION_SNAPSHOT_KEY)
    }
  }, [data, status])

  return null
}

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextAuthSessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <SessionSnapshotSync />
      {children}
    </NextAuthSessionProvider>
  )
}
