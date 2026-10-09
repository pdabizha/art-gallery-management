import { ARTWORK_TYPES, type ArtworkType, type SortOrder } from "@/api/artwork.types";

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
