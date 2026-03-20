import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_PATHS = ['/login', '/register']

const getSessionCookieName = () => {
  const secure = (process.env.NEXTAUTH_URL || '').startsWith('https://')
  const prefix = secure ? '__Secure-' : ''

  try {
    const parsed = new URL(process.env.NEXTAUTH_URL || '')
    const suffix = parsed.port || parsed.hostname.replace(/\./g, '-')
    return `${prefix}next-auth.session-token.${suffix}`
  } catch {
    return `${prefix}next-auth.session-token`
  }
}

export function middleware(request: NextRequest) {
  return handleMiddleware(request)
}

async function handleMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const secret =
    process.env.NEXTAUTH_SECRET_CURRENT || process.env.NEXTAUTH_SECRET || ''
  const cookieName = getSessionCookieName()

  const decodedToken = (await getToken({
    req: request,
    secret,
    cookieName,
  })) as Record<string, unknown> | null

  const roles = Array.isArray(decodedToken?.roles)
    ? (decodedToken.roles as string[])
    : []
  const hasValetRole = roles.includes('valet')

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/register')
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/login')) {
    if (decodedToken && hasValetRole) {
      const rootUrl = request.nextUrl.clone()
      rootUrl.pathname = '/'
      return NextResponse.redirect(rootUrl)
    }

    return NextResponse.next()
  }

  if (!decodedToken || !hasValetRole) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\..*).*)'],
}