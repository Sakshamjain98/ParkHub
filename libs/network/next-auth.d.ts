import type { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: Omit<DefaultUser, 'id'> & { uid: string }
    accessToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    apiAccessToken?: string
  }
}
