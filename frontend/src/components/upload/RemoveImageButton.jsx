import { CloseIcon } from '../icons'

/** Circular dismiss control overlaid on the image preview. */
function RemoveImageButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove image"
      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink shadow-md transition-colors hover:bg-primary hover:text-white"
    >
      <CloseIcon className="h-4 w-4" />
    </button>
  )
}

export default RemoveImageButton
