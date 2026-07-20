import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useAnalysis from '../hooks/useAnalysis'
import { analyzeImage } from '../services/analysisService'
import ScanPreview from '../components/analysis/ScanPreview'
import AnalysisProgress from '../components/analysis/AnalysisProgress'

/** Runs the real analysis while the staged progress animation plays. */
function AnalyzingColors() {
  const navigate = useNavigate()
  const { image, result, setResult, reset } = useAnalysis()
  const [animationDone, setAnimationDone] = useState(false)
  const [error, setError] = useState(null)
  const requestStarted = useRef(false)
  const navigateTimer = useRef(null)

  // Kick off the API request once (ref guards StrictMode's double effect).
  useEffect(() => {
    if (!image || requestStarted.current) return
    requestStarted.current = true
    analyzeImage(image.file)
      .then(setResult)
      .catch((err) => setError(err.message))
  }, [image, setResult])

  useEffect(() => () => clearTimeout(navigateTimer.current), [])

  // Move on when both the animation and the API call have finished.
  useEffect(() => {
    if (!animationDone || !result) return
    navigateTimer.current = setTimeout(() => navigate('/results'), 900)
  }, [animationDone, result, navigate])

  const handleComplete = useCallback(() => setAnimationDone(true), [])

  const handleTryAgain = () => {
    reset()
    navigate('/')
  }

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
        <ScanPreview
          previewUrl={image.previewUrl}
          scanning={!animationDone && !error}
        />
        {error ? (
          <section
            aria-label="Analysis error"
            className="rounded-sm border border-line bg-white p-7 shadow-sm sm:p-9"
          >
            <h2 className="text-lg font-bold text-ink">
              We couldn't analyze this photo
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-light">{error}</p>
            <button
              type="button"
              onClick={handleTryAgain}
              className="mt-6 rounded-sm bg-primary px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-dark"
            >
              Try another photo
            </button>
          </section>
        ) : (
          <AnalysisProgress onComplete={handleComplete} />
        )}
      </div>
    </div>
  )
}

export default AnalyzingColors
