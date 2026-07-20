import { CheckIcon } from '../icons'

function isLight(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 186
}

/**
 * Premium color card: lifts on hover, copies its HEX on click.
 * `copied` is controlled by the parent so only one card shows feedback.
 */
function PaletteCard({ name, hex, copied, onCopy }) {
  const lightSwatch = isLight(hex)

  return (
    <button
      type="button"
      onClick={() => onCopy(hex)}
      title={`Copy ${hex}`}
      className="group overflow-hidden rounded-md border border-line bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
    >
      <span
        className="relative block h-24 transition-transform duration-300 sm:h-28"
        style={{ backgroundColor: hex }}
      >
        <span
          className={`absolute inset-0 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide transition-opacity duration-200 ${
            copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          } ${lightSwatch ? 'text-ink' : 'text-white'}`}
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            'Copy HEX'
          )}
        </span>
      </span>
      <span className="block px-3.5 py-3">
        <span className="block truncate text-sm font-bold text-ink">{name}</span>
        <span className="mt-0.5 block font-mono text-xs uppercase text-ink-light">
          {hex}
        </span>
      </span>
    </button>
  )
}

export default PaletteCard
