import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useAnalysis from '../hooks/useAnalysis'
import PreviewCanvas from '../components/preview/PreviewCanvas'
import PreviewPalette from '../components/preview/PreviewPalette'
import { ArrowLeftIcon, SparkleIcon } from '../components/icons'

/**
 * Virtual Color Preview page.
 *
 * Reuses the uploaded image and palettes from the AnalysisContext, and
 * anchors the drape to the face geometry returned by /analyze. No webcam,
 * no MediaPipe, no extra backend calls.
 */
function Preview() {
  const navigate = useNavigate()
  const { image, result } = useAnalysis()
  const [selectedColor, setSelectedColor] = useState(null)

  // Guard: redirect to home if no analysis data
  if (!image || !result) return <Navigate to="/" replace />

  // Merge seasonal + personalized palettes for full selection
  const allColors = [
    ...(result.personalizedPalette || []),
    ...(result.seasonalPalette || []),
  ]

  return (
    <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-8 lg:py-12">
      {/* Header */}
      <header className="animate-rise mb-8">
        <button
          type="button"
          onClick={() => navigate('/results')}
          className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-light transition-colors hover:text-primary"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Results
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Virtual Color Preview
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-light sm:text-base">
          Tap a color below to see how it looks draped over you — no camera
          needed.
        </p>
      </header>

      {/* Canvas + drape overlay */}
      <div className="animate-rise overflow-hidden rounded-2xl border border-line bg-[#1a1a2e] shadow-xl"
           style={{ animationDelay: '80ms' }}>
        <PreviewCanvas
          previewUrl={image.previewUrl}
          selectedColor={selectedColor}
          facePosition={result.facePosition}
        />
      </div>

      {/* Color info bar */}
      <div
        className="animate-rise mt-6 flex items-center justify-between rounded-xl border border-line bg-white px-5 py-4 shadow-sm"
        style={{ animationDelay: '160ms' }}
      >
        {selectedColor ? (
          <div className="flex items-center gap-4">
            <span
              className="block h-10 w-10 shrink-0 rounded-lg border border-line shadow-sm"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <div>
              <p className="text-sm font-bold text-ink">{selectedColor.name}</p>
              <p className="font-mono text-xs uppercase text-ink-light">
                {selectedColor.hex}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-ink-light">
            <SparkleIcon className="h-5 w-5" />
            <p className="text-sm">Select a color from your palette below</p>
          </div>
        )}

        {selectedColor && (
          <button
            type="button"
            onClick={() => setSelectedColor(null)}
            className="text-xs font-bold uppercase tracking-wide text-ink-light transition-colors hover:text-primary"
          >
            Clear
          </button>
        )}
      </div>

      {/* Palette strip */}
      <div
        className="animate-rise mt-5 rounded-xl border border-line bg-white px-5 py-4 shadow-sm"
        style={{ animationDelay: '240ms' }}
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-light">
          Your Palette
        </p>
        <PreviewPalette
          colors={allColors}
          selectedHex={selectedColor?.hex ?? null}
          onSelect={setSelectedColor}
        />
      </div>
    </div>
  )
}

export default Preview
