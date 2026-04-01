import { getViewsStore } from '@/lib/views'
import { getSeed } from '@/lib/view-seeds'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { slug } = await req.json()
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const store = getViewsStore()
  const current = await store.get(slug, { type: 'json' }) as number | null

  // First view ever: start from the seed value
  const count = current === null ? getSeed(slug) + 1 : current + 1
  await store.setJSON(slug, count)

  return NextResponse.json({ count })
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const store = getViewsStore()
  const count = (await store.get(slug, { type: 'json' }) as number | null) ?? getSeed(slug)
  return NextResponse.json({ count })
}
