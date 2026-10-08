import { useLocalStorage } from '@/hooks/useLocalStorage'
import { initialArtworks } from '../data/initialArtworks'
import type { Artwork } from '../types/artwork'

export function useArtworks() {
  const [artworks, setArtworks] = useLocalStorage<Artwork[]>('gallery:artworks', initialArtworks)

  const addArtwork = (data: Omit<Artwork, 'id'>) => {
    setArtworks((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
  }

  const removeArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((a) => a.id !== id))
  }

  return { artworks, addArtwork, removeArtwork }
}
