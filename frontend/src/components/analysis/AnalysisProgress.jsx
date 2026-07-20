import { useEffect } from 'react'
import useAnalysisStages from '../../hooks/useAnalysisStages'
import StageItem from './StageItem'
import ProgressBar from './ProgressBar'

// Mock timing — replaced by real backend progress in a later phase.
const STAGES = [
  { label: 'Detecting face', duration: 1200 },
  { label: 'Detecting facial landmarks', duration: 1500 },
  { label: 'Extracting skin, eye, lip and hair colors', duration: 1900 },
  { label: 'Predicting undertone', duration: 1300 },
  { label: 'Predicting seasonal palette', duration: 1500 },
]

/**
 * Staged progress panel for the analysis screen.
 * Calls `onComplete` once every stage has finished.
 */
function AnalysisProgress({ onComplete }) {
  const { statuses, isComplete, completedCount } = useAnalysisStages(STAGES)

  useEffect(() => {
    if (isComplete) onComplete?.()
  }, [isComplete, onComplete])

  return (
    <section
      aria-label="Analysis progress"
      className="rounded-sm border border-line bg-white p-7 shadow-sm sm:p-9"
    >
      <h2 className="text-lg font-bold text-ink">Analyzing your colors</h2>
      <p className="mt-1.5 text-sm text-ink-light">
        This usually takes a few seconds.
      </p>

      <div className="mt-6">
        <ProgressBar value={completedCount / STAGES.length} />
      </div>

      <ul className="mt-7 space-y-5">
        {STAGES.map((stage, i) => (
          <StageItem
            key={stage.label}
            label={stage.label}
            status={statuses[i]}
            index={i}
          />
        ))}
      </ul>

      <p
        className={`mt-8 text-sm font-bold text-primary transition-opacity duration-500 ${
          isComplete ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden={!isComplete}
      >
        Analysis complete — preparing your results…
      </p>
    </section>
  )
}

export default AnalysisProgress
