function ConfidenceRing({ value }) {
  const radius = 26
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative h-16 w-16">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#ff3f6c"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-ink">
        {Math.round(value * 100)}%
      </span>
    </div>
  )
}

function StatTile({ label, children }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-line bg-white px-4 py-5 text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-ink-light">
        {label}
      </span>
      {children}
    </div>
  )
}

/** Season, undertone and confidence at a glance, with a short explanation. */
function AnalysisSummary({ seasonProfile, undertoneProfile, confidence }) {
  const overallConfidence = (confidence.season + confidence.undertone) / 2

  return (
    <section
      aria-label="Analysis summary"
      className="rounded-md border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Season">
          <span className="text-2xl font-bold text-primary">{seasonProfile.title}</span>
          <span className="text-xs text-ink-light">{seasonProfile.tagline}</span>
        </StatTile>
        <StatTile label="Undertone">
          <span className="text-2xl font-bold text-ink">{undertoneProfile.title}</span>
          <span className="text-xs text-ink-light">{undertoneProfile.descriptor}</span>
        </StatTile>
        <StatTile label="Confidence">
          <ConfidenceRing value={overallConfidence} />
        </StatTile>
      </div>

      <p className="mt-6 text-[15px] leading-relaxed text-ink">
        {seasonProfile.description}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-light">
        {undertoneProfile.note}
      </p>
    </section>
  )
}

export default AnalysisSummary
