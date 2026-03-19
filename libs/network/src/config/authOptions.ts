import { NextAuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import {
  AuthProviderType,
  GetAuthProviderDocument,
  LoginDocument,
  RegisterWithProviderDocument,
} from '@ParkHub/network/src/gql/generated'
import { fetchGraphQL } from '../fetch'
import * as jwt from 'jsonwebtoken'
import { JWT } from 'next-auth/jwt'

const MAX_AGE = 1 * 24 * 60 * 60
const MIN_SECRET_LENGTH = 32

const parseSecretList = (value?: string) =>
  (value || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

const assertStrongSecret = (secret: string, label: string) => {
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `${label} must be at least ${MIN_SECRET_LENGTH} characters long.`,
    )
  }
}

const secureCookies = process.env.NEXTAUTH_URL?.startsWith('https://')
const hostName = new URL(process.env.NEXTAUTH_URL || '').hostname
const rootDomain = 'karthicktech.com'
const cookieDomain = hostName === 'localhost' ? undefined : '.' + rootDomain

const authSecretCurrent =
  process.env.NEXTAUTH_SECRET_CURRENT || process.env.NEXTAUTH_SECRET || ''

if (!authSecretCurrent) {
  throw new Error(
    'Missing NextAuth secret. Set NEXTAUTH_SECRET_CURRENT (recommended) or NEXTAUTH_SECRET.',
  )
}

assertStrongSecret(authSecretCurrent, 'NEXTAUTH_SECRET_CURRENT')

const authSecretPrevious = parseSecretList(process.env.NEXTAUTH_SECRET_PREVIOUS)
authSecretPrevious.forEach((secret, index) => {
  assertStrongSecret(secret, `NEXTAUTH_SECRET_PREVIOUS[${index}]`)
})

const authSecretsForVerify = [authSecretCurrent, ...authSecretPrevious]

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
          const { data, error } = await fetchGraphQL({
            document: LoginDocument,
            variables: { loginInput: { email, password } },
          })

          if (!data?.login.token || error) {
            throw new Error(
              'Authentication failed: Invalid credentials or user not found',
            )
          }
          const decodedLoginToken = jwt.decode(data.login.token) as
            | { uid?: string }
            | null
          const uid = decodedLoginToken?.uid || email
          const image = data.login.user.image
          const name = data.login.user.name

          return {
            id: uid,
            name,
            image,
            email,
            apiAccessToken: data.login.token,
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
  },

  // Configure JWT settings
  jwt: {
    maxAge: MAX_AGE,
    // Custom JWT encoding function
    async encode({ token, secret }): Promise<string> {
      // Implement custom JWT encoding logic
      if (!token) {
        throw new Error('Token is undefined')
      }
      const { sub, ...tokenProps } = token
      // Get the current date in seconds since the epoch
      const nowInSeconds = Math.floor(Date.now() / 1000)
      // Calculate the expiration timestamp
      const expirationTimestamp = nowInSeconds + MAX_AGE
      return jwt.sign(
        { uid: sub, ...tokenProps, exp: expirationTimestamp },
        authSecretCurrent,
        {
          algorithm: 'HS256',
        },
      )
    },
    // Custom JWT decoding function
    async decode({ token, secret }): Promise<JWT | null> {
      // Implement custom JWT decoding logic
      if (!token) {
        throw new Error('Token is undefined')
      }
      const candidateSecrets = [secret, ...authSecretsForVerify].filter(
        Boolean,
      ) as string[]

      for (const signingSecret of candidateSecrets) {
        try {
          const decodedToken = jwt.verify(token, signingSecret, {
            algorithms: ['HS256'],
          })
          return decodedToken as JWT
        } catch {
          // Try next secret to support rotation.
        }
      }

      return null
      // ...
    },
  },
  cookies: {
    sessionToken: {
      name: `${secureCookies ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: secureCookies,
        ...(cookieDomain ? { domain: cookieDomain } : null),
      },
    },
  },

  // Configure callback functions
  callbacks: {
    // Sign-in callback
    async signIn({ user, account }) {
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
      if (user && 'apiAccessToken' in user) {
        token.apiAccessToken = (user as { apiAccessToken?: string })
          .apiAccessToken
      }
      return token
    },

    // Session callback
    async session({ token, session }) {
      // Customize session object based on token data
      if (token) {
        session.user = {
          image: token.picture,
          uid: (token.uid as string) || '',
          email: token.email,
          name: token.name,
        }
        session.accessToken = token.apiAccessToken as string | undefined
      }
      return session
      // ...
    },
  },

  // Configure custom pages
  pages: {
    signIn: '/signIn',
  },
}

export const getAuth = () => getServerSession(authOptions)
