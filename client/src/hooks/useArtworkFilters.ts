import { useEffect, useMemo, useState } from 'react'
import type { Artwork, ArtworkType, SortOrder } from '../types/artwork'
import { ALL, getArtists, getVisibleArtworks, parseSortOrder, parseType } from '../utils/artworks'
import type { AllOr } from '../utils/artworks'
import { useDebounce } from './useDebounce'

const readParam = (key: string) => new URLSearchParams(window.location.search).get(key) ?? ''

export function useArtworkFilters(artworks: Artwork[]) {
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => parseSortOrder(readParam('sort')))
  const [searchInput, setSearchInput] = useState(() => readParam('search'))
  const [selectedArtist, setArtist] = useState(() => readParam('artist') || ALL)
  const [type, setType] = useState<AllOr<ArtworkType>>(() => parseType(readParam('type')))
  const debouncedSearch = useDebounce(searchInput, 400)

  const artists = useMemo(() => getArtists(artworks), [artworks])

  const artist = selectedArtist === ALL || artists.includes(selectedArtist) ? selectedArtist : ALL

  useEffect(() => {
    const params = new URLSearchParams()
    const query = debouncedSearch.trim()

    if (sortOrder !== 'none') params.set('sort', sortOrder)
    if (query) params.set('search', query)
    if (artist !== ALL) params.set('artist', artist)
    if (type !== ALL) params.set('type', type)

    const queryString = params.toString()
    window.history.replaceState(
      null,
      '',
      queryString ? `?${queryString}` : window.location.pathname,
    )
  }, [sortOrder, debouncedSearch, artist, type])

  const visibleArtworks = useMemo(
    () => getVisibleArtworks(artworks, { search: debouncedSearch, sortOrder, artist, type }),
    [artworks, debouncedSearch, sortOrder, artist, type],
  )

  const hasActiveFilters = artist !== ALL || type !== ALL || searchInput.trim() !== ''

  const resetFilters = () => {
    setSearchInput('')
    setArtist(ALL)
    setType(ALL)
  }

  return {
    searchInput,
    setSearchInput,
    sortOrder,
    setSortOrder,
    artist,
    setArtist,
    type,
    setType,
    artists,
    visibleArtworks,
    hasActiveFilters,
    resetFilters,
  }
}
