import { NextRequest, NextResponse } from 'next/server'

const AUTHENTICATED_PATHS = ['/bookings']

function getAppCookieSuffix(nextAuthUrl: string): string {
  try {
    const parsed = new URL(nextAuthUrl)
    return parsed.port || parsed.hostname.replace(/\./g, '-')
  } catch {
    return ''
  }
}

function getSessionTokenName(nextAuthUrl: string, isSecure: boolean): string {
  const suffix = getAppCookieSuffix(nextAuthUrl)
  const prefix = isSecure ? '__Secure-' : ''
  return `${prefix}next-auth.session-token${suffix ? `.${suffix}` : ''}`
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const isAuthenticatedPath = AUTHENTICATED_PATHS.some((path) =>
    pathname.startsWith(path),
  )

  if (!isAuthenticatedPath) {
    return NextResponse.next()
  }

  const nextAuthUrl = process.env.NEXTAUTH_URL || ''
  const isSecure = nextAuthUrl.startsWith('https://')
  const sessionTokenName = getSessionTokenName(nextAuthUrl, isSecure)
  
  const token = request.cookies.get(sessionTokenName)?.value

  if (!token) {
    const rootUrl = request.nextUrl.clone()
    rootUrl.pathname = '/'
    return NextResponse.redirect(rootUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\..*).*)'],
}