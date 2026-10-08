import { Facebook, Instagram, Twitter } from 'flowbite-react-icons/solid'

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'Twitter', href: '#', Icon: Twitter },
  { label: 'Instagram', href: '#', Icon: Instagram },
]

export function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 px-4 py-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="font-bold">ArtGalleryManager</p>
          <p className="text-sm">
            Your go-to platform for managing and exploring exquisite art pieces
          </p>
        </div>

        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a key={label} href={href} aria-label={label} className="hover:text-slate-300">
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
