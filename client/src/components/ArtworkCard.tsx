import type { KeyboardEvent } from 'react'
import { PLACEHOLDER_IMAGE } from '../data/initialArtworks'
import type { Artwork } from '../types/artwork'

interface ArtworkCardProps {
  artwork: Artwork
  selectable?: boolean
  onSelect?: (artwork: Artwork) => void
}

export function ArtworkCard({ artwork, selectable = false, onSelect }: ArtworkCardProps) {
  const { title, artist, price, imageUrl } = artwork

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(artwork)
    }
  }

  return (
    <article
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
      aria-label={selectable ? `Remove ${title}` : undefined}
      onClick={selectable ? () => onSelect?.(artwork) : undefined}
      onKeyDown={selectable ? handleKeyDown : undefined}
      className={`group flex flex-col gap-2 rounded-xl border p-3 transition ${
        selectable
          ? 'cursor-pointer border-dashed border-red-400 bg-red-50 outline-none hover:border-red-600 hover:ring-2 hover:ring-red-500/40 focus-visible:ring-2 focus-visible:ring-red-500'
          : 'border-gray-200'
      }`}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = PLACEHOLDER_IMAGE
          }}
          className="aspect-4/3 w-full rounded-lg object-cover"
        />
        {selectable && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-red-600/60 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            Click to remove
          </div>
        )}
      </div>
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
