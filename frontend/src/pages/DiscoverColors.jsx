import UploadCard from '../components/upload/UploadCard'
import WhyColorAnalysis from '../components/upload/WhyColorAnalysis'

/** Phase 1 — Upload Screen. Analysis flow hooks in via handleContinue later. */
function DiscoverColors() {
  const handleContinue = (file) => {
    // Backend integration lands in a later phase:
    // upload `file` to the FastAPI analysis endpoint, then navigate to results.
    void file
  }

  const handleTakePhoto = () => {
    // Camera capture flow lands in a later phase (UI only for now).
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 lg:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Discover Your Colors
      </h1>
      <p className="mt-3 text-base text-ink-light sm:text-lg">
        Upload a selfie to find your perfect color palette.
      </p>

      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_400px]">
        <UploadCard onContinue={handleContinue} onTakePhoto={handleTakePhoto} />
        <WhyColorAnalysis />
      </div>
    </div>
  )
}

export default DiscoverColors
