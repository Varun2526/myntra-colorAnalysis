import { UploadIcon } from '../icons'

/** Clickable upload prompt shown inside the drag & drop area. */
function UploadButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-4 outline-none"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded bg-gray-200/80 text-ink-light transition-colors group-hover:bg-gray-200 group-hover:text-ink">
        <UploadIcon className="h-6 w-6" />
      </span>
      <span className="text-lg font-bold text-ink">
        Drag &amp; drop or click to upload
      </span>
      <span className="text-sm text-ink-light">Supports JPEG, PNG</span>
    </button>
  )
}

export default UploadButton
