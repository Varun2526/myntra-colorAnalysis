import { CheckIcon } from '../icons'

const BENEFITS = [
  'Discover your personal color season',
  'Get product recommendations that suit you',
  'Build a wardrobe that makes you glow',
]

function MiniLogo() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded bg-white shadow-sm">
      <svg viewBox="0 0 32 24" className="h-4 w-5" aria-hidden="true">
        <path d="M2 22 9 3l7 12L23 3l7 19" fill="none" stroke="#ff3f6c" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

/** Sidebar card: benefits list + AI-powered attribution. */
function WhyColorAnalysis() {
  return (
    <aside className="flex h-full flex-col rounded-sm border border-line bg-white p-7 shadow-sm">
      <h2 className="text-lg font-bold text-ink">Why Color Analysis?</h2>

      <ul className="mt-6 space-y-5">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-center gap-3.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-xs bg-primary text-white">
              <CheckIcon className="h-3 w-3" />
            </span>
            <span className="text-[15px] text-ink">{benefit}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center gap-3.5 rounded-sm border border-primary/25 bg-primary-light p-4 pt-14 sm:mt-16 sm:pt-4">
        <MiniLogo />
        <div>
          <p className="text-sm font-bold text-ink">AI-Powered Analysis</p>
          <p className="text-[13px] text-ink-light">
            Powered by FitFluent Intelligence
          </p>
        </div>
      </div>
    </aside>
  )
}

export default WhyColorAnalysis
