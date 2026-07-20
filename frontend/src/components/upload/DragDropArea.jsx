import UploadButton from './UploadButton'
import CameraButton from './CameraButton'

const PALETTE = ['#f7c8d0', '#f5a9b8', '#c9a5f5', '#a5c8f5', '#a5e8c9', '#f5e3a5']

/** Decorative seasonal-palette dots to hint at the analysis result. */
function PaletteStrip() {
  return (
    <div className="flex items-center" aria-hidden="true">
      {PALETTE.map((color, i) => (
        <span
          key={color}
          className="h-6 w-6 rounded-full border-2 border-white shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5"
          style={{
            backgroundColor: color,
            marginLeft: i === 0 ? 0 : '-8px',
            transitionDelay: `${i * 40}ms`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Empty-state drop zone: drag & drop surface, upload prompt,
 * camera action, and photo guidance.
 */
function DragDropArea({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowse,
  onTakePhoto,
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex min-h-[480px] flex-col items-center justify-center gap-7 px-6 py-14 transition-colors duration-300 ${
        isDragging ? 'bg-primary-light' : 'bg-gray-50 group-hover:bg-primary-light/40'
      }`}
    >
      <UploadButton onClick={onBrowse} isDragging={isDragging} />
      <CameraButton onClick={onTakePhoto} />
      <PaletteStrip />
      <p className="text-center text-sm text-ink-light">
        Natural lighting · No makeup · Neutral backdrop
      </p>
    </div>
  )
}

export default DragDropArea
