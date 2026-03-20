import type { DefaultUser } from 'next-auth'
import { Role } from '@ParkHub/util/types'

declare module 'next-auth' {
  interface Session {
    user?: Omit<DefaultUser, 'id'> & { uid: string; roles?: Role[] }
    accessToken?: string
    authError?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid?: string
    apiAccessToken?: string
    refreshToken?: string
    accessTokenExpiresAt?: number
    authError?: string
    roles?: Role[]
  }
}
