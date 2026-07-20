import { DownloadIcon, RefreshIcon } from '../icons'

/** Uploaded selfie with the primary result actions. */
function ProfileCard({ previewUrl, onAnalyzeAgain, onDownloadReport }) {
  return (
    <section
      aria-label="Your photo"
      className="overflow-hidden rounded-md border border-line bg-white shadow-sm"
    >
      <img
        src={previewUrl}
        alt="Your analyzed selfie"
        className="max-h-[420px] w-full bg-gray-100 object-contain"
      />
      <div className="flex flex-col gap-3 p-5">
        <button
          type="button"
          onClick={onAnalyzeAgain}
          className="flex items-center justify-center gap-2.5 rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-dark"
        >
          <RefreshIcon className="h-4.5 w-4.5" />
          Analyze Again
        </button>
        <button
          type="button"
          onClick={onDownloadReport}
          className="flex items-center justify-center gap-2.5 rounded-sm border border-line px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
        >
          <DownloadIcon className="h-4.5 w-4.5" />
          Download Report
        </button>
      </div>
    </section>
  )
}

export default ProfileCard
