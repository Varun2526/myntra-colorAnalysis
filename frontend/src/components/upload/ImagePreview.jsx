import RemoveImageButton from './RemoveImageButton'

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Selected-image state: preview with remove control and file details. */
function ImagePreview({ file, previewUrl, onRemove }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 bg-gray-50 px-6 py-10">
      <div className="relative">
        <img
          src={previewUrl}
          alt="Selected selfie preview"
          className="max-h-[340px] max-w-full rounded-md object-contain shadow-sm"
        />
        <RemoveImageButton onClick={onRemove} />
      </div>
      <p className="max-w-full truncate text-sm text-ink-light">
        <span className="font-bold text-ink">{file.name}</span>
        {' · '}
        {formatSize(file.size)}
      </p>
    </div>
  )
}

export default ImagePreview
