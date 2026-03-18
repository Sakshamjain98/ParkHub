import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@autospace/network/src/config/authOptions'

export async function GET(req: NextRequest) {
  const session = await getAuth()
  return NextResponse.json(session?.accessToken || '')
}
