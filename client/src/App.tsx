import { useState } from 'react'
import { Button } from './components/ui/button'
import { ArtworkForm } from './components/ArtworkForm'
import { ArtworkGrid } from './components/ArtworkGrid'
import { ConfirmDialog } from './components/ConfirmDialog'
import { GalleryToolbar } from './components/GalleryToolbar'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { useArtworkFilters } from './hooks/useArtworkFilters'
import { useArtworks } from './hooks/useArtworks'
import type { Artwork } from './types/artwork'

function App() {
  const { artworks, addArtwork, removeArtwork } = useArtworks()
  const filters = useArtworkFilters(artworks)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isRemoveMode, setIsRemoveMode] = useState(false)
  const [artworkToDelete, setArtworkToDelete] = useState<Artwork | null>(null)

  const handleAdd = (data: Omit<Artwork, 'id'>) => {
    addArtwork(data)
    setIsFormOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!artworkToDelete) return
    removeArtwork(artworkToDelete.id)
    setArtworkToDelete(null)
    setIsRemoveMode(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col gap-3 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold">Explore our collection</h1>

        <GalleryToolbar filters={filters} />

        <div className="flex gap-3">
          <Button className="w-fit" onClick={() => setIsFormOpen(true)} disabled={isRemoveMode}>
            Add New Artwork
          </Button>
          <Button
            className="w-fit"
            onClick={() => setIsRemoveMode((prev) => !prev)}
            disabled={artworks.length === 0}
          >
            {isRemoveMode ? 'Cancel Removal' : 'Remove Artwork'}
          </Button>
        </div>

        {isRemoveMode && (
          <p className="text-sm text-red-600">Select an artwork you want to remove.</p>
        )}

        <ArtworkGrid
          artworks={filters.visibleArtworks}
          isGalleryEmpty={artworks.length === 0}
          selectable={isRemoveMode}
          onSelect={setArtworkToDelete}
        />
      </main>

      <Footer />

      {isFormOpen && <ArtworkForm onSubmit={handleAdd} onCancel={() => setIsFormOpen(false)} />}

      {artworkToDelete && (
        <ConfirmDialog
          title="Remove artwork?"
          description={`"${artworkToDelete.title}" by ${artworkToDelete.artist} will be permanently removed from the gallery.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setArtworkToDelete(null)}
        />
      )}
    </div>
  )
}

export default App
