import Link from 'next/link'

type House = {
  id: string
  title: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  imageUrl: string | null
}

async function getHouses(): Promise<House[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/houses`, {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Failed to fetch houses')
  return res.json()
}

export default async function HousesPage() {
  const houses = await getHouses()

  return (
    <main style={{ maxWidth: 980, margin: '0 auto', padding: 24 }}>
      <h1>Houses</h1>
      <p>
        <Link href="/add-house">+ Add new house</Link>
      </p>

      {houses.length === 0 ? (
        <p>No listings yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {houses.map((house) => (
            <article key={house.id} style={{ border: '1px solid #ddd', borderRadius: 10, overflow: 'hidden' }}>
              {house.imageUrl ? (
                <img src={house.imageUrl} alt={house.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              ) : (
                <div style={{ height: 160, background: '#f4f4f4', display: 'grid', placeItems: 'center' }}>No image</div>
              )}
              <div style={{ padding: 12 }}>
                <h3>{house.title}</h3>
                <p>{house.location}</p>
                <p>KES {house.price.toLocaleString()}</p>
                <p>
                  {house.bedrooms} bed • {house.bathrooms} bath
                </p>
                <Link href={`/houses/${house.id}`}>View details</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
