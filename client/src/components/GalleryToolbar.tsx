import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { ALL, SORT_OPTIONS, TYPE_OPTIONS, parseSortOrder, parseType } from '../utils/artworks'
import type { useArtworkFilters } from '../hooks/useArtworkFilters'

interface GalleryToolbarProps {
  filters: ReturnType<typeof useArtworkFilters>
}

export function GalleryToolbar({ filters }: GalleryToolbarProps) {
  const artistOptions = [
    { label: 'All artists', value: ALL },
    ...filters.artists.map((a) => ({ label: a, value: a })),
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search..."
        value={filters.searchInput}
        onChange={(e) => filters.setSearchInput(e.target.value)}
        className="max-w-100"
      />
      <Select
        value={filters.artist}
        onChange={filters.setArtist}
        options={artistOptions}
        className="w-fit"
      />
      <Select
        value={filters.type}
        onChange={(value) => filters.setType(parseType(value))}
        options={TYPE_OPTIONS}
        className="w-fit"
      />
      <Select
        value={filters.sortOrder}
        onChange={(value) => filters.setSortOrder(parseSortOrder(value))}
        options={SORT_OPTIONS}
        className="w-fit"
      />
      {filters.hasActiveFilters && (
        <Button className="w-fit" onClick={filters.resetFilters}>
          Reset
        </Button>
      )}
    </div>
  )
}
