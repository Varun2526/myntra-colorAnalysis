import { useEffect, useRef, useState } from 'react'
import useCamera from '../../hooks/useCamera'
import { CameraIcon, RefreshIcon, CloseIcon } from '../icons'

/**
 * Full-screen camera modal: live preview → capture → confirm/retake.
 * On confirm, hands a JPEG File to `onCapture` so it flows through the
 * exact same analysis path as an uploaded image.
 */
function CameraCapture({ onCapture, onClose }) {
  const { videoRef, status, error, start, stop, capture } = useCamera()
  const [shot, setShot] = useState(null) // { file, url } once captured
  const shotRef = useRef(null)

  useEffect(() => {
    start()
    return () => {
      if (shotRef.current) URL.revokeObjectURL(shotRef.current)
    }
  }, [start])

  const handleCapture = async () => {
    const file = await capture()
    if (!file) return
    const url = URL.createObjectURL(file)
    shotRef.current = url
    setShot({ file, url })
  }

  const handleRetake = () => {
    if (shotRef.current) URL.revokeObjectURL(shotRef.current)
    shotRef.current = null
    setShot(null)
  }

  const handleUsePhoto = () => {
    stop()
    onCapture(shot.file)
  }

  const handleCancel = () => {
    stop()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="text-sm font-bold uppercase tracking-wide">
          Take a Photo
        </span>
        <button
          type="button"
          onClick={handleCancel}
          aria-label="Cancel"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden px-4">
        {error ? (
          <div className="max-w-sm text-center text-white">
            <p className="text-sm leading-relaxed text-white/80">{error}</p>
          </div>
        ) : (
          <div className="relative flex max-h-full w-full max-w-2xl items-center justify-center">
            {/* Live preview — mirrored for a natural selfie feel */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`max-h-[70vh] w-full rounded-lg object-contain -scale-x-100 ${
                shot ? 'hidden' : 'block'
              }`}
            />
            {shot && (
              <img
                src={shot.url}
                alt="Captured photo preview"
                className="max-h-[70vh] w-full rounded-lg object-contain -scale-x-100"
              />
            )}
            {status === 'starting' && (
              <p className="absolute text-sm text-white/70">Starting camera…</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 px-5 py-8">
        {error ? (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-sm border border-white/40 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10"
          >
            Cancel
          </button>
        ) : shot ? (
          <>
            <button
              type="button"
              onClick={handleRetake}
              className="flex items-center gap-2.5 rounded-sm border border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10"
            >
              <RefreshIcon className="h-4.5 w-4.5" />
              Retake
            </button>
            <button
              type="button"
              onClick={handleUsePhoto}
              className="rounded-sm bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-primary-dark"
            >
              Use Photo
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-sm border border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCapture}
              disabled={status !== 'live'}
              className="flex items-center gap-2.5 rounded-sm bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-white/30"
            >
              <CameraIcon className="h-5 w-5" />
              Capture
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default CameraCapture
