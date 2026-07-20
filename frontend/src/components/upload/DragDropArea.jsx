import UploadButton from './UploadButton'
import CameraButton from './CameraButton'

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
      className={`flex min-h-[420px] flex-col items-center justify-center gap-7 px-6 py-14 transition-colors ${
        isDragging ? 'bg-primary-light' : 'bg-gray-50'
      }`}
    >
      <UploadButton onClick={onBrowse} />
      <CameraButton onClick={onTakePhoto} />
      <p className="text-center text-sm text-ink-light">
        Natural lighting · No makeup · Neutral backdrop
      </p>
    </div>
  )
}

export default DragDropArea
