import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getArtworks, getArtwork, createArtwork, updateArtwork, deleteArtwork, uploadArtworkImage } from './artwork.api'

import type { Artwork } from './artwork.types'

export const artworkKeys = {
  all: ['artworks'] as const,
  lists: () => [...artworkKeys.all, 'list'] as const,
  details: () => [...artworkKeys.all, 'detail'] as const,
  detail: (id: string) => [...artworkKeys.details(), id] as const,
}

export function useGetArtworks() {
  return useQuery({
    queryKey: artworkKeys.lists(),
    queryFn: getArtworks,
  })
}

export function useGetArtworkById(id: string) {
  return useQuery({
    queryKey: artworkKeys.detail(id),
    queryFn: () => getArtwork(id),
    enabled: Boolean(id),
  })
}

export function useCreateArtwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (artwork: Omit<Artwork, 'id'>) => createArtwork(artwork),
    onSuccess: (createdArtwork) => {
      queryClient.setQueryData<Artwork[]>(artworkKeys.lists(), (current = []) => [
        ...current,
        createdArtwork,
      ])

      queryClient.setQueryData(artworkKeys.detail(createdArtwork.id), createdArtwork)

      void queryClient.invalidateQueries({
        queryKey: artworkKeys.lists(),
      })
    },
  })
}

export function useUpdateArtwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, artwork }: { id: string; artwork: Partial<Omit<Artwork, 'id'>> }) =>
      updateArtwork(id, artwork),

    onSuccess: (updatedArtwork) => {
      queryClient.setQueryData(artworkKeys.detail(updatedArtwork.id), updatedArtwork)

      void queryClient.invalidateQueries({
        queryKey: artworkKeys.lists(),
      })
    },
  })
}

export function useDeleteArtwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteArtwork(id),

    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: artworkKeys.detail(id),
      })

      void queryClient.invalidateQueries({
        queryKey: artworkKeys.lists(),
      })
    },
  })
}

export function useUploadArtworkImage() {
  return useMutation({ mutationFn: uploadArtworkImage })
}
