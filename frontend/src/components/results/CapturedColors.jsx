import SectionHeading from './SectionHeading'

const FEATURE_ORDER = ['eye', 'hair', 'skin', 'lips']
const FEATURE_LABELS = { eye: 'Eye', hair: 'Hair', skin: 'Skin', lips: 'Lips' }

function FeatureSwatch({ label, hex, rgb }) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-line bg-white p-4 shadow-sm">
      <span
        className="h-14 w-14 shrink-0 rounded-full border border-black/10 shadow-inner"
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink">{label}</p>
        <p className="mt-0.5 font-mono text-xs uppercase text-ink-light">{hex}</p>
        <p className="font-mono text-xs text-ink-light">
          rgb({rgb.join(', ')})
        </p>
      </div>
    </div>
  )
}

/** The four feature colors extracted from the selfie. */
function CapturedColors({ features }) {
  return (
    <section aria-label="Captured colors" className="space-y-5">
      <SectionHeading
        title="Captured Colors"
        subtitle="What our AI read from your photo"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FEATURE_ORDER.map((key) => (
          <FeatureSwatch
            key={key}
            label={FEATURE_LABELS[key]}
            hex={features[key].hex}
            rgb={features[key].rgb}
          />
        ))}
      </div>
    </section>
  )
}

export default CapturedColors
