import { ARTWORK_TYPES } from '../types/artwork'
import type { Artwork, ArtworkType, SortOrder } from '../types/artwork'

export const ALL = 'all'
export type AllOr<T> = T | typeof ALL

export const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'Sort by', value: 'none' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
]

export function parseSortOrder(value: string): SortOrder {
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as SortOrder) : 'none'
}

export function parseType(value: string): AllOr<ArtworkType> {
  return ARTWORK_TYPES.includes(value as ArtworkType) ? (value as ArtworkType) : ALL
}

export const TYPE_OPTIONS = [
  { label: 'All types', value: ALL },
  ...ARTWORK_TYPES.map((t) => ({ label: t, value: t })),
]

export function getArtists(artworks: Artwork[]): string[] {
  return [...new Set(artworks.map((a) => a.artist))].sort((a, b) => a.localeCompare(b))
}

interface VisibleOptions {
  search: string
  sortOrder: SortOrder
  artist: string
  type: AllOr<ArtworkType>
}

export function getVisibleArtworks(
  artworks: Artwork[],
  { search, sortOrder, artist, type }: VisibleOptions,
): Artwork[] {
  const query = search.trim().toLowerCase()

  const filtered = artworks.filter((a) => {
    if (artist !== ALL && a.artist !== artist) return false
    if (type !== ALL && a.type !== type) return false
    if (!query) return true
    return a.title.toLowerCase().includes(query) || a.artist.toLowerCase().includes(query)
  })

  if (sortOrder === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price)
  if (sortOrder === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price)
  return filtered
}
