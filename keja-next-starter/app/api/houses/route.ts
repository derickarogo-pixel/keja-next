import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { HouseInput } from '@/types/house'

function validateHousePayload(body: Partial<HouseInput>) {
  const errors: string[] = []

  if (!body.title?.trim()) errors.push('title is required')
  if (!body.location?.trim()) errors.push('location is required')
  if (body.price == null || Number.isNaN(Number(body.price))) {
    errors.push('price must be a number')
  }

  if (body.price != null && Number(body.price) < 0) errors.push('price must be >= 0')
  if (body.bedrooms != null && Number(body.bedrooms) < 0) errors.push('bedrooms must be >= 0')
  if (body.bathrooms != null && Number(body.bathrooms) < 0) errors.push('bathrooms must be >= 0')

  return errors
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const houses = await prisma.house.findMany({
      where: {
        ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
        ...(minPrice || maxPrice
          ? {
              price: {
                ...(minPrice ? { gte: Number(minPrice) } : {}),
                ...(maxPrice ? { lte: Number(maxPrice) } : {}),
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(houses)
  } catch (error) {
    console.error('GET /api/houses failed:', error)
    return NextResponse.json({ error: 'Failed to fetch houses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<HouseInput>
    const errors = validateHousePayload(body)

    if (errors.length) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const house = await prisma.house.create({
      data: {
        title: body.title!.trim(),
        description: body.description?.trim() || null,
        location: body.location!.trim(),
        price: Number(body.price),
        bedrooms: Number(body.bedrooms ?? 0),
        bathrooms: Number(body.bathrooms ?? 0),
        imageUrl: body.imageUrl?.trim() || null,
      },
    })

    return NextResponse.json(house, { status: 201 })
  } catch (error) {
    console.error('POST /api/houses failed:', error)
    return NextResponse.json({ error: 'Failed to create house' }, { status: 500 })
  }
}
