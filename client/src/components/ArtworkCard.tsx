import { Button } from './ui/button'
import type { Artwork } from '../api/artwork.types'

interface ArtworkCardProps {
  artwork: Artwork
  onDelete: (artwork: Artwork) => void
}

export function ArtworkCard({ artwork, onDelete }: ArtworkCardProps) {
  const { title, artist, price, imageUrl } = artwork

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-gray-200 p-3">
      <img
        src={imageUrl}
        alt={title}
        onError={(e) => {
          e.currentTarget.onerror = null
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
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="mt-1 w-full"
        aria-label={`Delete ${title}`}
        onClick={() => onDelete(artwork)}
      >
        Delete
      </Button>
    </article>
  )
}