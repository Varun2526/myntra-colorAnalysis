import SectionHeading from './SectionHeading'

/** Sample clothing color chips for the predicted season. */
function OutfitColors({ colors }) {
  return (
    <section aria-label="Recommended outfit colors" className="space-y-5">
      <SectionHeading
        title="Recommended Outfit Colors"
        subtitle="Build your wardrobe around these shades"
      />
      <div className="flex flex-wrap gap-3">
        {colors.map(({ name, hex }) => (
          <span
            key={`${name}-${hex}`}
            className="flex items-center gap-2.5 rounded-full border border-line bg-white py-2 pl-2.5 pr-4 text-sm font-bold text-ink shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span
              className="h-6 w-6 rounded-full border border-black/10"
              style={{ backgroundColor: hex }}
              aria-hidden="true"
            />
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}

export default OutfitColors
