import useImageUpload from '../../hooks/useImageUpload'
import DragDropArea from './DragDropArea'
import ImagePreview from './ImagePreview'
import ContinueButton from './ContinueButton'

/**
 * The dashed upload card. Owns image-selection state via useImageUpload and
 * switches between the empty drop zone and the selected-image preview.
 * `onContinue(file)` is the hook point for backend integration later.
 */
function UploadCard({ onContinue, onTakePhoto }) {
  const {
    file,
    previewUrl,
    error,
    isDragging,
    inputRef,
    openFileDialog,
    onInputChange,
    onDragOver,
    onDragLeave,
    onDrop,
    removeImage,
  } = useImageUpload()

  return (
    <section aria-label="Selfie upload">
      <div
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-primary' : 'border-gray-300'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={onInputChange}
          className="hidden"
        />

        {file ? (
          <ImagePreview file={file} previewUrl={previewUrl} onRemove={removeImage} />
        ) : (
          <DragDropArea
            isDragging={isDragging}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onBrowse={openFileDialog}
            onTakePhoto={onTakePhoto}
          />
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-bold text-primary">
          {error}
        </p>
      )}

      {file && (
        <div className="mt-6 flex justify-center">
          <ContinueButton onClick={() => onContinue?.(file)} />
        </div>
      )}
    </section>
  )
}

export default UploadCard
