import { notFound } from 'next/navigation'
import Link from 'next/link'

type House = {
  id: string
  title: string
  description: string | null
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  imageUrl: string | null
}

async function getHouse(id: string): Promise<House | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/houses/${id}`, {
    cache: 'no-store',
  })

  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch house')
  return res.json()
}

export default async function HouseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const house = await getHouse(id)

  if (!house) notFound()

  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: 24 }}>
      <p>
        <Link href="/houses">← Back to houses</Link>
      </p>
      <h1>{house.title}</h1>
      <p>{house.location}</p>
      <p>KES {house.price.toLocaleString()}</p>
      <p>
        {house.bedrooms} bedrooms • {house.bathrooms} bathrooms
      </p>
      {house.imageUrl && <img src={house.imageUrl} alt={house.title} style={{ width: '100%', borderRadius: 8 }} />}
      <p style={{ marginTop: 16 }}>{house.description || 'No description provided.'}</p>
    </main>
  )
}
