import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Manages a getUserMedia webcam stream for a <video> element and captures
 * frames to a JPEG File. UI-agnostic so the camera component stays small.
 *
 * status: 'idle' | 'starting' | 'live' | 'error'
 */
function messageForError(err) {
  switch (err?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Camera access is blocked. Allow the camera for this site in your browser (and in your OS privacy settings), then try again — or upload a photo instead.'
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'No camera was found on this device. Upload a photo instead.'
    case 'NotReadableError':
    case 'TrackStartError':
      return 'Your camera is in use by another app. Close it and try again, or upload a photo instead.'
    default:
      return 'We couldn’t access your camera. Check your browser permissions, or upload a photo instead.'
  }
}

function useCamera() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error')
      setError('Your browser does not support camera access.')
      return
    }
    setStatus('starting')
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setStatus('live')
    } catch (err) {
      setStatus('error')
      setError(messageForError(err))
    }
  }, [])

  /** Draw the current video frame and resolve a JPEG File. */
  const capture = useCallback(async () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return null
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.92)
    )
    if (!blob) return null
    return new File([blob], `camera-capture-${canvas.width}x${canvas.height}.jpg`, {
      type: 'image/jpeg',
    })
  }, [])

  // Always release the camera when the consumer unmounts.
  useEffect(() => stop, [stop])

  return { videoRef, status, error, start, stop, capture }
}

export default useCamera
