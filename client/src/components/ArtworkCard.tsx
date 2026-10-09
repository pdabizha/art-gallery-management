import { Button } from './ui/button'
import type { Artwork } from '../api/artwork.types'

interface ArtworkCardProps {
  artwork: Artwork
  onEdit: (artwork: Artwork) => void
  onDelete: (artwork: Artwork) => void
}

export function ArtworkCard({ artwork, onEdit, onDelete }: ArtworkCardProps) {
  const { title, artist, price, imageUrl, availability } = artwork

  return (
    <article
      className={`group relative flex flex-col gap-2 rounded-xl border p-3 transition duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gray-400 ${
        availability ? 'border-gray-200' : 'border-gray-300 bg-gray-50'
      }`}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={title}
          className={`aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            availability ? '' : 'opacity-60 grayscale'
          }`}
        />
        {!availability && (
          <span className="absolute top-2 left-2 rounded-full bg-gray-900/80 px-2.5 py-1 text-xs font-semibold text-white">
            Not for sale
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <div
          className={`flex justify-between gap-2 font-bold ${availability ? '' : 'text-gray-500'}`}
        >
          <button
            type="button"
            onClick={() => onEdit(artwork)}
            aria-label={`Edit ${title}`}
            className="min-w-0 cursor-pointer truncate text-left outline-none after:absolute after:inset-0 after:rounded-xl"
          >
            {title}
          </button>
          <p>${price}</p>
        </div>
        <p className="text-xs text-gray-400">By: {artist}</p>
      </div>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="relative z-10 mt-1 w-fit ml-auto"
        aria-label={`Delete ${title}`}
        onClick={() => onDelete(artwork)}
      >
        Delete
      </Button>
    </article>
  )
}
