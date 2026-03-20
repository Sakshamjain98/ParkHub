import { NextAuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import {
  AuthProviderType,
  GetAuthProviderDocument,
  RegisterWithProviderDocument,
} from '@ParkHub/network/src/gql/generated'
import { fetchGraphQL } from '../fetch'
import * as jwt from 'jsonwebtoken'
import { Role } from '@ParkHub/util/types'

const MAX_AGE = 1 * 24 * 60 * 60
const MIN_SECRET_LENGTH = 32
const DEV_FALLBACK_NEXTAUTH_SECRET =
  'dev-only-nextauth-secret-change-this-2026'

const nextAuthUrl = process.env.NEXTAUTH_URL || ''

if (!nextAuthUrl) {
  throw new Error('Missing NEXTAUTH_URL.')
}

const assertStrongSecret = (secret: string, label: string) => {
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `${label} must be at least ${MIN_SECRET_LENGTH} characters long.`,
    )
  }
}

const secureCookies = nextAuthUrl.startsWith('https://')
const hostName = new URL(nextAuthUrl).hostname
const isLocalhost =
  hostName === 'localhost' ||
  hostName === '127.0.0.1' ||
  hostName === '0.0.0.0'
const appCookieSuffix = (() => {
  try {
    const parsed = new URL(nextAuthUrl)
    return parsed.port || parsed.hostname.replace(/\./g, '-')
  } catch {
    return ''
  }
})()
const domainParts = hostName.split('.')
const rootDomain =
  domainParts.length >= 2 ? domainParts.slice(-2).join('.') : hostName
const cookieDomain = isLocalhost ? undefined : '.' + rootDomain

const envAuthSecretCurrent =
  process.env.NEXTAUTH_SECRET_CURRENT || process.env.NEXTAUTH_SECRET || ''

const authSecretCurrent =
  envAuthSecretCurrent ||
  (process.env.NODE_ENV === 'production' ? '' : DEV_FALLBACK_NEXTAUTH_SECRET)

if (!authSecretCurrent && process.env.NODE_ENV === 'production') {
  throw new Error(
    'Missing NextAuth secret. Set NEXTAUTH_SECRET_CURRENT (recommended) or NEXTAUTH_SECRET.',
  )
}

assertStrongSecret(authSecretCurrent, 'NEXTAUTH_SECRET_CURRENT')

const portalRoleFromEnv = process.env.PORTAL_REQUIRED_ROLE as Role | undefined

const requiredRoleForPortal = (() => {
  if (
    portalRoleFromEnv &&
    ['admin', 'manager', 'valet'].includes(portalRoleFromEnv)
  ) {
    return portalRoleFromEnv
  }

  try {
    const parsed = new URL(nextAuthUrl)
    if (parsed.port === '3002') return 'manager' as Role
    if (parsed.port === '3003') return 'valet' as Role
    if (parsed.port === '3004') return 'admin' as Role
    return null
  } catch {
    return null
  }
})()

type AuthApiLoginResponse = {
  token: string
  refreshToken: string
  user: {
    name?: string | null
    image?: string | null
  }
}

const authApiUrl =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000'

const callAuthGraphQL = async <TData,>(query: string, variables: Record<string, unknown>) => {
  const response = await fetch(`${authApiUrl}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })

  const payload = (await response.json()) as {
    data?: TData
    errors?: Array<{ message?: string }>
  }

  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.[0]?.message || 'Authentication request failed.')
  }

  if (!payload.data) {
    throw new Error('Empty GraphQL response payload.')
  }

  return payload.data
}

const loginWithCredentials = (email: string, password: string) =>
  callAuthGraphQL<{ login: AuthApiLoginResponse }>(
    `mutation Login($loginInput: LoginInput!) {
      login(loginInput: $loginInput) {
        token
        refreshToken
        user {
          name
          image
        }
      }
    }`,
    { loginInput: { email, password } },
  )

const refreshWithToken = (refreshToken: string) =>
  callAuthGraphQL<{ refreshLogin: AuthApiLoginResponse }>(
    `mutation RefreshLogin($refreshToken: String!) {
      refreshLogin(refreshToken: $refreshToken) {
        token
        refreshToken
        user {
          name
          image
        }
      }
    }`,
    { refreshToken },
  )

const decodeAccessToken = (token: string) =>
  jwt.decode(token) as
    | { uid?: string; roles?: Role[]; exp?: number }
    | null

export const authOptions: NextAuthOptions = {
  secret: authSecretCurrent,
  // Configure authentication providers
  providers: [
    // Google OAuth provider configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid profile',
        },
      },
    }),
    // Credentials provider configuration for email/password authentication
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // Authorize function to validate user credentials
      async authorize(credentials) {
        // Implement credential validation logic
        if (!credentials) {
          throw new Error('Email and password are required')
        }
        const { email, password } = credentials

        try {
          const { login } = await loginWithCredentials(email, password)

          if (!login?.token || !login?.refreshToken) {
            throw new Error(
              'Authentication failed: Invalid credentials or user not found',
            )
          }

          const decodedLoginToken = decodeAccessToken(login.token)
          const uid = decodedLoginToken?.uid || email
          const roles = decodedLoginToken?.roles || []
          const accessTokenExpiresAt = (decodedLoginToken?.exp || 0) * 1000

          if (requiredRoleForPortal && !roles.includes(requiredRoleForPortal)) {
            throw new Error(
              `Access denied. ${requiredRoleForPortal} role is required for this portal.`,
            )
          }

          const image = login.user.image
          const name = login.user.name

          return {
            id: uid,
            name,
            image,
            email,
            apiAccessToken: login.token,
            refreshToken: login.refreshToken,
            roles,
            accessTokenExpiresAt,
          }
        } catch (error) {
          console.error('Credentials authorize failed', error)
        }
        return null
      },
    }),
  ],

  // Enable debug mode for development
  debug: true,

  // Configure session settings
  session: {
    strategy: 'jwt',
    maxAge: MAX_AGE,
    updateAge: 60 * 60,
  },

  // Configure JWT settings
  jwt: {
    maxAge: MAX_AGE,
  },
  cookies: {
    sessionToken: {
      name: `${secureCookies ? '__Secure-' : ''}next-auth.session-token${
        appCookieSuffix ? `.${appCookieSuffix}` : ''
      }`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: secureCookies,
        maxAge: MAX_AGE,
        priority: 'high',
        ...(cookieDomain ? { domain: cookieDomain } : null),
      },
    },
  },

  // Configure callback functions
  callbacks: {
    // Sign-in callback
    async signIn({ user, account }) {
      if (requiredRoleForPortal && account?.provider === 'google') {
        return false
      }

      // Implement sign-in logic, e.g., create user in database
      if (account?.provider === 'google') {
        const { id, name, image } = user

        const existingUser = await fetchGraphQL({
          document: GetAuthProviderDocument,
          variables: {
            uid: id,
          },
        })

        if (!existingUser.data?.getAuthProvider?.uid) {
          const newUser = await fetchGraphQL({
            document: RegisterWithProviderDocument,
            variables: {
              registerWithProviderInput: {
                uid: id,
                type: AuthProviderType.Google,
                image,
                name: name || '',
              },
            },
          })
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id || token.uid
        token.apiAccessToken = (user as { apiAccessToken?: string }).apiAccessToken
        token.refreshToken = (user as { refreshToken?: string }).refreshToken
        token.roles = (user as { roles?: Role[] }).roles || []
        token.accessTokenExpiresAt =
          (user as { accessTokenExpiresAt?: number }).accessTokenExpiresAt || 0
        token.authError = undefined
        return token
      }

      const expiresAt = Number(token.accessTokenExpiresAt || 0)
      if (token.apiAccessToken && expiresAt > Date.now() + 60_000) {
        return token
      }

      if (!token.refreshToken) {
        token.authError = 'MissingRefreshToken'
        return token
      }

      try {
        const { refreshLogin } = await refreshWithToken(String(token.refreshToken))
        const decoded = decodeAccessToken(refreshLogin.token)

        token.apiAccessToken = refreshLogin.token
        token.refreshToken = refreshLogin.refreshToken
        token.roles = decoded?.roles || token.roles || []
        token.uid = decoded?.uid || token.uid || token.sub
        token.accessTokenExpiresAt = (decoded?.exp || 0) * 1000
        token.authError = undefined
      } catch {
        token.authError = 'RefreshAccessTokenError'
      }

      return token
    },

    // Session callback
    async session({ token, session }) {
      // Customize session object based on token data
      if (token) {
        session.user = {
          image: token.picture,
          uid: (token.uid as string) || (token.sub as string) || '',
          email: token.email,
          name: token.name,
          roles: (token.roles as Role[] | undefined) || [],
        }
        session.accessToken = token.apiAccessToken as string | undefined
        session.authError = token.authError as string | undefined
      }
      return session
      // ...
    },
  },

  // Configure custom pages
  pages: {
    signIn: '/login',
  },
}

export const getAuth = () => getServerSession(authOptions)
