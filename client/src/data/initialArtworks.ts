import type { Artwork } from '../types/artwork'

export const PLACEHOLDER_IMAGE = '/images/placeholder.jpg'

export const initialArtworks: Artwork[] = [
  {
    id: 'a1',
    title: 'Abstract Vibrance',
    artist: 'Alex Johnson',
    type: 'Painting',
    price: 5500,
    isAvailable: true,
    imageUrl: '/images/abstract-vibrance.jpg',
  },
  {
    id: 'a2',
    title: 'Tranquil Lake',
    artist: 'Maria Gonzalez',
    type: 'Painting',
    price: 3500,
    isAvailable: true,
    imageUrl: '/images/tranquil-lake.jpg',
  },
  {
    id: 'a3',
    title: 'Geometric Harmony',
    artist: 'Liam Smith',
    type: 'Digital',
    price: 11000,
    isAvailable: false,
    imageUrl: '/images/geometric-harmony.jpg',
  },
  {
    id: 'a4',
    title: 'Silent Bronze',
    artist: 'Sofia Rossi',
    type: 'Sculpture',
    price: 8200,
    isAvailable: true,
    imageUrl: '/images/sculpture.jpg',
  },
]
