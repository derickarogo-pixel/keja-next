'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddHousePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const payload = {
      title: String(formData.get('title') || ''),
      location: String(formData.get('location') || ''),
      price: Number(formData.get('price') || 0),
      bedrooms: Number(formData.get('bedrooms') || 0),
      bathrooms: Number(formData.get('bathrooms') || 0),
      imageUrl: String(formData.get('imageUrl') || ''),
      description: String(formData.get('description') || ''),
    }

    const res = await fetch('/api/houses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.errors?.join(', ') || data?.error || 'Failed to create listing')
      return
    }

    router.push('/houses')
    router.refresh()
  }

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: 24 }}>
      <h1>Add House</h1>
      <form action={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input name="title" placeholder="Title" required />
        <input name="location" placeholder="Location" required />
        <input name="price" type="number" min={0} placeholder="Price" required />
        <input name="bedrooms" type="number" min={0} placeholder="Bedrooms" />
        <input name="bathrooms" type="number" min={0} placeholder="Bathrooms" />
        <input name="imageUrl" type="url" placeholder="Image URL" />
        <textarea name="description" placeholder="Description" rows={5} />

        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create listing'}
        </button>
      </form>
    </main>
  )
}
