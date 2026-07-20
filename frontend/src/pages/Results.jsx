import { Navigate, useNavigate } from 'react-router-dom'
import useAnalysis from '../hooks/useAnalysis'
import { SEASON_CONTENT } from '../data/seasonContent'
import ProfileCard from '../components/results/ProfileCard'
import AnalysisSummary from '../components/results/AnalysisSummary'
import CapturedColors from '../components/results/CapturedColors'
import PaletteSection from '../components/results/PaletteSection'
import FashionTips from '../components/results/FashionTips'
import OutfitColors from '../components/results/OutfitColors'
import ExploreCTA from '../components/results/ExploreCTA'

/** Results page — renders the analysis produced during /analyzing. */
function Results() {
  const navigate = useNavigate()
  const { image, result, reset } = useAnalysis()

  if (!image || !result) return <Navigate to="/" replace />

  const handleAnalyzeAgain = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 lg:py-14">
      <header className="animate-rise">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Your Personal Color Analysis
        </h1>
        <p className="mt-3 max-w-2xl text-base text-ink-light sm:text-lg">
          You're a{result.season === 'autumn' ? 'n' : ''}{' '}
          <span className="font-bold text-primary">
            {SEASON_CONTENT[result.season].title}
          </span>{' '}
          with a {result.undertone} undertone — here are the colors that make
          you glow.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[360px_1fr]">
        <div className="lg:sticky lg:top-28 space-y-4">
          <ProfileCard
            previewUrl={image.previewUrl}
            onAnalyzeAgain={handleAnalyzeAgain}
            onDownloadReport={() => {
              // UI only — report generation lands with the backend phase.
            }}
          />
          <button
            type="button"
            onClick={() => navigate('/preview')}
            className="flex w-full items-center justify-center gap-2.5 rounded-md bg-gradient-to-r from-primary to-[#ff8f3f] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            ✨ Try Virtual Draping
          </button>
        </div>

        <div className="min-w-0 space-y-12">
          <AnalysisSummary
            season={result.season}
            undertone={result.undertone}
            confidence={result.confidence}
          />
          <CapturedColors features={result.features} />
          <PaletteSection
            title="Recommended Seasonal Palette"
            subtitle={`The classic ${SEASON_CONTENT[result.season].title} colors, curated by stylists`}
            colors={result.seasonalPalette}
          />
          <PaletteSection
            title="Personalized Palette"
            subtitle="Generated uniquely from your skin tone — tap any color to copy"
            colors={result.personalizedPalette}
          />
          <FashionTips season={result.season} />
          <OutfitColors colors={result.outfitColors} />
          <ExploreCTA
            seasonTitle={SEASON_CONTENT[result.season].title}
            onExplore={() => {
              // UI only — deep link into Myntra search lands later.
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Results
