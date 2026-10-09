import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getArtworks,
  createArtwork,
  deleteArtwork,
  uploadArtworkImage,
  getArtists,
  updateArtwork,
} from './artwork.api'

import type { Artwork, ArtworkQuery } from './artwork.types'

export const artworkKeys = {
  all: ['artworks'] as const,
  list: (query: ArtworkQuery) => [...artworkKeys.all, 'list', query] as const,
  artists: () => [...artworkKeys.all, 'artists'] as const,
}

export function useGetArtworks(query: ArtworkQuery = {}) {
  return useQuery({
    queryKey: artworkKeys.list(query),
    queryFn: () => getArtworks(query),
    placeholderData: keepPreviousData,
  })
}

export function useCreateArtwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (artwork: Omit<Artwork, 'id'>) => createArtwork(artwork),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: artworkKeys.all })
    },
  })
}

export function useUpdateArtwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, artwork }: { id: string; artwork: Partial<Omit<Artwork, 'id'>> }) =>
      updateArtwork(id, artwork),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: artworkKeys.all })
    },
  })
}

export function useDeleteArtwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteArtwork(id),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: artworkKeys.all })
    },
  })
}

export function useUploadArtworkImage() {
  return useMutation({ mutationFn: uploadArtworkImage })
}

export function useGetArtists() {
  return useQuery({ queryKey: artworkKeys.artists(), queryFn: getArtists })
}
