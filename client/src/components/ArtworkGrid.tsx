import { ArtworkCard } from './ArtworkCard'
import type { Artwork } from '../types/artwork'

interface ArtworkGridProps {
  artworks: Artwork[]
  isGalleryEmpty: boolean
  selectable: boolean
  onSelect: (artwork: Artwork) => void
}

export function ArtworkGrid({ artworks, isGalleryEmpty, selectable, onSelect }: ArtworkGridProps) {
  if (artworks.length === 0) {
    return (
      <p className="py-10 text-center text-gray-500">
        {isGalleryEmpty ? 'The gallery is empty.' : 'No artworks found.'}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((item) => (
        <ArtworkCard key={item.id} artwork={item} selectable={selectable} onSelect={onSelect} />
      ))}
    </div>
  )
}
