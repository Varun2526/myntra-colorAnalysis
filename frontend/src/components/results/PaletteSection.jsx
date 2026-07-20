import SectionHeading from './SectionHeading'
import PaletteCard from './PaletteCard'
import useCopyToClipboard from '../../hooks/useCopyToClipboard'

/** Reusable palette grid (seasonal + personalized) with copy-on-click cards. */
function PaletteSection({ title, subtitle, colors }) {
  const { copiedValue, copy } = useCopyToClipboard()

  return (
    <section aria-label={title} className="space-y-5">
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {colors.map((color) => (
          <PaletteCard
            key={`${color.name}-${color.hex}`}
            name={color.name}
            hex={color.hex}
            copied={copiedValue === color.hex}
            onCopy={copy}
          />
        ))}
      </div>
    </section>
  )
}

export default PaletteSection
