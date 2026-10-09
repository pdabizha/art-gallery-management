import { z } from 'zod'

export const TITLE_MAX_LENGTH = 99

export const artworkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(TITLE_MAX_LENGTH, `Title must be at most ${TITLE_MAX_LENGTH} characters`),

  artist: z.string().trim().min(1, 'Artist is required'),
  type: z.string().min(1, 'Select a type'),
  price: z.string().trim().min(1, 'Price is required'),
  availability: z.boolean(),
  imageUrl: z.string().min(1, 'Photo is required'),
})

export type ArtworkFormValues = z.infer<typeof artworkSchema>
