/**
 * Horizontal scrollable palette strip for the Preview page.
 * Clicking a swatch selects it and highlights it with a ring.
 */
function PreviewPalette({ colors, selectedHex, onSelect }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto px-1 py-2 scrollbar-none">
      {colors.map((color) => {
        const isActive = selectedHex === color.hex
        return (
          <button
            key={`${color.name}-${color.hex}`}
            type="button"
            onClick={() => onSelect(color)}
            title={`${color.name} — ${color.hex}`}
            className={`group relative shrink-0 transition-transform duration-200 ${
              isActive ? 'scale-110' : 'hover:scale-105'
            }`}
          >
            {/* Outer ring for active state */}
            <span
              className={`absolute -inset-1.5 rounded-full transition-opacity duration-200 ${
                isActive
                  ? 'opacity-100 ring-2 ring-primary ring-offset-2'
                  : 'opacity-0'
              }`}
            />
            {/* Swatch circle */}
            <span
              className="block h-10 w-10 rounded-full border border-white/30 shadow-md sm:h-12 sm:w-12"
              style={{ backgroundColor: color.hex }}
            />
          </button>
        )
      })}
    </div>
  )
}

export default PreviewPalette
