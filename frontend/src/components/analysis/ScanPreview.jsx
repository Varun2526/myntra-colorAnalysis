/** Uploaded selfie with an animated scan-line overlay while analysis runs. */
function ScanPreview({ previewUrl, scanning = true }) {
  return (
    <div className="relative overflow-hidden rounded-md bg-gray-100 shadow-sm">
      <img
        src={previewUrl}
        alt="Your uploaded selfie"
        className="max-h-[440px] w-full object-contain"
      />
      {scanning && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div
            className="absolute left-0 right-0 h-1 animate-scan rounded-full bg-primary/70 shadow-[0_0_18px_4px_rgba(255,63,108,0.45)]"
            aria-hidden="true"
          />
        </>
      )}
    </div>
  )
}

export default ScanPreview
