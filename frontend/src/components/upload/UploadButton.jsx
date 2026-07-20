import { UploadIcon } from '../icons'

/** Clickable upload prompt shown inside the drag & drop area. */
function UploadButton({ onClick, isDragging = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-4 outline-none"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded transition-all duration-300 ${
          isDragging
            ? 'scale-110 bg-primary text-white'
            : 'bg-gray-200/80 text-ink-light group-hover:scale-105 group-hover:bg-primary/10 group-hover:text-primary'
        }`}
      >
        <UploadIcon className="h-6 w-6" />
      </span>
      <span className="text-lg font-bold text-ink">
        {isDragging ? 'Drop your photo here' : 'Drag & drop or click to upload'}
      </span>
      <span className="text-sm text-ink-light">Supports JPEG, PNG</span>
    </button>
  )
}

export default UploadButton
