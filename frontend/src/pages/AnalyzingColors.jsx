import { useCallback, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAnalysis from '../hooks/useAnalysis'
import ScanPreview from '../components/analysis/ScanPreview'
import AnalysisProgress from '../components/analysis/AnalysisProgress'

/** Phase 2 — Analysis Loading screen. Results navigation lands in Phase 3. */
function AnalyzingColors() {
  const { image } = useAnalysis()
  const [isComplete, setIsComplete] = useState(false)

  const handleComplete = useCallback(() => {
    setIsComplete(true)
    // Phase 3: navigate to the results page here.
  }, [])

  if (!image) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 lg:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Discover Your Colors
      </h1>
      <p className="mt-3 text-base text-ink-light sm:text-lg">
        Hold tight — our AI is reading your natural coloring.
      </p>

      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,540px)_1fr]">
        <ScanPreview previewUrl={image.previewUrl} scanning={!isComplete} />
        <AnalysisProgress onComplete={handleComplete} />
      </div>
    </div>
  )
}

export default AnalyzingColors
