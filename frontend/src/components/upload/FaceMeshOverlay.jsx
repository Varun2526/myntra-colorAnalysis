import { useEffect, useRef } from 'react'
import { DrawingUtils, FaceLandmarker } from '@mediapipe/tasks-vision'
import useFaceLandmarker from '../../hooks/useFaceLandmarker'

const CONTOURS = [
  FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
  FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
  FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
  FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
  FaceLandmarker.FACE_LANDMARKS_LIPS,
]

/**
 * Live MediaPipe face mesh drawn on a canvas that shares the video's exact
 * coordinate system: the canvas bitmap is sized to the SOURCE resolution
 * (video.videoWidth/videoHeight) and drawn with MediaPipe's DrawingUtils in
 * normalized coordinates. CSS then scales the canvas identically to the video,
 * so the mesh stays aligned at any display size / DPR. The wrapper mirrors
 * both video and canvas together, so landmarks mirror with the preview.
 *
 * Visualization only — landmarks are never sent anywhere; the backend runs its
 * own MediaPipe + ML pipeline at analysis time.
 */
function FaceMeshOverlay({ videoRef, active }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const { ready, detect } = useFaceLandmarker(active)

  useEffect(() => {
    if (!active || !ready) return undefined

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const utils = new DrawingUtils(ctx)
    let lastTs = -1

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop)
      const video = videoRef.current
      if (!video || !video.videoWidth) return

      // Requirement: canvas bitmap always matches the source frame size.
      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth
      if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const ts = performance.now()
      if (ts <= lastTs) return
      lastTs = ts

      const result = detect(video, ts)
      for (const landmarks of result?.faceLandmarks ?? []) {
        utils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: 'rgba(255,255,255,0.28)', lineWidth: 0.5 }
        )
        utils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, {
          color: '#ff3f6c',
          lineWidth: 2,
        })
        for (const conn of CONTOURS) {
          utils.drawConnectors(landmarks, conn, {
            color: '#ff9f8f',
            lineWidth: 1.5,
          })
        }
      }
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [active, ready, detect, videoRef])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}

export default FaceMeshOverlay
