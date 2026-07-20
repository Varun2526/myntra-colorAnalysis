import { useEffect, useState } from 'react'

/**
 * Advances through analysis stages on mock timing.
 * When the backend is wired in, this hook is the piece to replace with
 * real progress (or to fast-forward once the API responds).
 *
 * @param {Array<{label: string, duration: number}>} stages
 * @returns {{statuses: ('done'|'active'|'pending')[], isComplete: boolean, completedCount: number}}
 */
function useAnalysisStages(stages) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (activeIndex >= stages.length) return undefined
    const timer = setTimeout(
      () => setActiveIndex((i) => i + 1),
      stages[activeIndex].duration
    )
    return () => clearTimeout(timer)
  }, [activeIndex, stages])

  const statuses = stages.map((_, i) => {
    if (i < activeIndex) return 'done'
    if (i === activeIndex) return 'active'
    return 'pending'
  })

  return {
    statuses,
    isComplete: activeIndex >= stages.length,
    completedCount: Math.min(activeIndex, stages.length),
  }
}

export default useAnalysisStages
