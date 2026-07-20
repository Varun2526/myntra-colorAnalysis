import SectionHeading from './SectionHeading'
import { SEASON_CONTENT } from '../../data/seasonContent'
import { SparkleIcon } from '../icons'

/** Season-specific styling recommendations. */
function FashionTips({ season }) {
  const { title, tips } = SEASON_CONTENT[season]

  return (
    <section aria-label="Fashion tips" className="space-y-5">
      <SectionHeading
        title="Fashion Tips"
        subtitle={`How to dress your ${title} palette`}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className="flex gap-4 rounded-md border border-line bg-white p-5 shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
              <SparkleIcon className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">{tip.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-light">
                {tip.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FashionTips
