import { useEffect, useState } from 'react'
import type { ArtworkQuery, ArtworkType, SortOrder } from '../api/artwork.types'
import { ALL, parseSortOrder, parseType } from '../utils/artworks'
import type { AllOr } from '../utils/artworks'
import { useGetArtists } from '../api/artwork.queries'
import { useDebounce } from './useDebounce'

const readParam = (key: string) => new URLSearchParams(window.location.search).get(key) ?? ''

export function useArtworkFilters() {
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => parseSortOrder(readParam('sort')))
  const [searchInput, setSearchInput] = useState(() => readParam('search'))
  const [selectedArtist, setArtist] = useState(() => readParam('artist') || ALL)
  const [type, setType] = useState<AllOr<ArtworkType>>(() => parseType(readParam('type')))

  const debouncedSearch = useDebounce(searchInput, 400)

  const { data: artists = [], isSuccess: artistsLoaded } = useGetArtists()

  const artist =
    artistsLoaded && selectedArtist !== ALL && !artists.includes(selectedArtist)
      ? ALL
      : selectedArtist

  const search = debouncedSearch.trim()

  useEffect(() => {
    const params = new URLSearchParams()

    if (sortOrder !== 'none') params.set('sort', sortOrder)
    if (search) params.set('search', search)
    if (artist !== ALL) params.set('artist', artist)
    if (type !== ALL) params.set('type', type)

    const queryString = params.toString()
    window.history.replaceState(
      null,
      '',
      queryString ? `?${queryString}` : window.location.pathname,
    )
  }, [sortOrder, search, artist, type])

  const query: ArtworkQuery = {
    search: search || undefined,
    artist: artist !== ALL ? artist : undefined,
    type: type !== ALL ? type : undefined,
    sort: sortOrder !== 'none' ? sortOrder : undefined,
  }

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
    query,
    hasActiveFilters,
    resetFilters,
  }
}
