export const ARTWORK_TYPES = ['Painting', 'Sculpture', 'Photography', 'Digital', 'Drawing'] as const

export type ArtworkType = (typeof ARTWORK_TYPES)[number]

export interface Artwork {
  id: string
  title: string
  artist: string
  type: ArtworkType
  price: number
  availability: boolean
  imageUrl: string
}

export type SortOrder = 'none' | 'price-asc' | 'price-desc'

export interface ArtworkQuery {
  search?: string
  artist?: string
  type?: ArtworkType
  sort?: Exclude<SortOrder, 'none'>
}
