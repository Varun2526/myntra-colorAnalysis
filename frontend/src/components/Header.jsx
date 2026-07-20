import { SearchIcon, ProfileIcon, HeartIcon, BagIcon } from './icons'
import logo from '../assets/logo.png'

const NAV_ITEMS = [
  { label: 'Men' },
  { label: 'Women' },
  { label: 'Kids' },
  { label: 'Home' },
  { label: 'Beauty' },
  { label: 'Genz' },
  { label: 'Studio' },
  { label: 'Fitfluent', highlight: true, badge: 'New' },
]

const ACTIONS = [
  { label: 'Profile', Icon: ProfileIcon },
  { label: 'Wishlist', Icon: HeartIcon },
  { label: 'Bag', Icon: BagIcon },
]

function Logo() {
  return (
    <a href="/" className="shrink-0" aria-label="Myntra home">
      <img src={logo} alt="Myntra" className="h-12 w-auto object-contain" />
    </a>
  )
}

function NavLink({ label, active, highlight, badge }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`relative flex h-20 items-center border-b-2 px-1 text-sm font-bold uppercase tracking-wide transition-colors ${
        active
          ? 'border-primary text-ink'
          : highlight
            ? 'border-primary text-primary'
            : 'border-transparent text-ink hover:border-primary'
      }`}
    >
      {badge && (
        <span className="absolute -top-0 left-1/2 -translate-x-1/2 translate-y-2.5 text-[10px] font-extrabold uppercase text-primary">
          {badge}
        </span>
      )}
      {label}
    </a>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-8 px-4 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>

        <div className="ml-auto hidden min-w-0 max-w-[430px] flex-1 items-center gap-3 rounded-md bg-gray-100 px-4 py-2.5 md:flex">
          <SearchIcon className="h-4.5 w-4.5 shrink-0 text-ink-light" />
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-light"
          />
        </div>

        <div className="ml-auto flex items-center gap-6 md:ml-0">
          {ACTIONS.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              className="flex flex-col items-center gap-0.5 text-ink hover:text-primary"
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] font-bold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header
