/** Consistent heading for each results section. */
function SectionHeading({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
        {title}
      </h2>
      {subtitle && <p className="mt-1.5 text-sm text-ink-light">{subtitle}</p>}
    </div>
  )
}

export default SectionHeading
