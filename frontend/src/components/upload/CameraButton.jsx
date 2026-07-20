import { CameraIcon } from '../icons'

/** "Take a Photo" action — UI only for now; capture flow lands in a later phase. */
function CameraButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-sm bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30"
    >
      <CameraIcon className="h-5 w-5" />
      Take a Photo
    </button>
  )
}

export default CameraButton
