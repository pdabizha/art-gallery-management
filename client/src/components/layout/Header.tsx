import { Palette } from 'flowbite-react-icons/solid'

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-slate-50 p-4 shadow-md">
      <a
        href="/"
        aria-label="ArtGalleryManager"
        className="flex items-center gap-2 font-bold text-gray-900"
      >
        <Palette />
        ArtGalleryManager
      </a>
    </header>
  )
}
