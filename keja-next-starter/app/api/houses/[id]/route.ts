import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const house = await prisma.house.findUnique({ where: { id } })

    if (!house) {
      return NextResponse.json({ error: 'House not found' }, { status: 404 })
    }

    return NextResponse.json(house)
  } catch (error) {
    console.error('GET /api/houses/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to fetch house' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await req.json()

    const updated = await prisma.house.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: String(body.title) } : {}),
        ...(body.description !== undefined ? { description: body.description ? String(body.description) : null } : {}),
        ...(body.location !== undefined ? { location: String(body.location) } : {}),
        ...(body.price !== undefined ? { price: Number(body.price) } : {}),
        ...(body.bedrooms !== undefined ? { bedrooms: Number(body.bedrooms) } : {}),
        ...(body.bathrooms !== undefined ? { bathrooms: Number(body.bathrooms) } : {}),
        ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl ? String(body.imageUrl) : null } : {}),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/houses/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to update house' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    await prisma.house.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/houses/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to delete house' }, { status: 500 })
  }
}
