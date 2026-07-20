import { CameraIcon } from '../icons'

/** "Take a Photo" action — UI only for now; capture flow lands in a later phase. */
function CameraButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-sm border border-primary px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary-light"
    >
      <CameraIcon className="h-5 w-5" />
      Take a Photo
    </button>
  )
}

export default CameraButton
