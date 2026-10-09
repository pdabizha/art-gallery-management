import axios from 'axios'
import type { Artwork, ArtworkQuery } from './artwork.types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
})

export const getArtworks = async (query: ArtworkQuery = {}): Promise<Artwork[]> => {
  const { data } = await apiClient.get<Artwork[]>('/artworks', { params: query })
  return data
}

export const getArtists = async (): Promise<string[]> => {
  const { data } = await apiClient.get<string[]>('/artworks/artists')
  return data
}

export const createArtwork = async (artwork: Omit<Artwork, 'id'>): Promise<Artwork> => {
  const { data } = await apiClient.post<Artwork>('/artworks', artwork)
  return data
}

export const deleteArtwork = async (id: string): Promise<void> => {
  await apiClient.delete(`/artworks/${id}`)
}

export const uploadArtworkImage = async (
  file: File,
): Promise<{ imageUrl: string; publicId: string }> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post('/artworks/upload', formData)

  return data
}
