import { PLACEHOLDER_IMAGE } from '../data/initialArtworks'
import type { Artwork } from '../types/artwork'

interface ArtworkCardProps {
  artwork: Artwork
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const { title, artist, price, imageUrl } = artwork

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-gray-200 p-2">
      <img
        src={imageUrl}
        alt={title}
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = PLACEHOLDER_IMAGE
        }}
        className="aspect-4/3 w-full rounded-lg object-cover"
      />
      <div className="flex flex-col">
        <div className="flex justify-between gap-2 font-bold">
          <p className="line-clamp-1">{title}</p>
          <p>${price}</p>
        </div>
        <p className="text-xs text-gray-400">By: {artist}</p>
      </div>
    </article>
  )
}
