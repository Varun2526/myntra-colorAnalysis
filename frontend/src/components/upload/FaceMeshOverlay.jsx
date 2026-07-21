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

const IRISES = [
  FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
  FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
]

/**
 * Live MediaPipe face mesh drawn on a canvas that shares the video's exact
 * coordinate system.
 *
 * The canvas bitmap is sized to the video's ON-SCREEN size × devicePixelRatio,
 * so lines are crisp on HiDPI screens. Landmarks come back normalized (0–1),
 * so DrawingUtils maps them to that bitmap and CSS displays the canvas over the
 * exact same box as the video (they share the wrapper, so their rects coincide;
 * the wrapper's mirror flips both together). Line widths are scaled by DPR so
 * they render at a consistent visible thickness.
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

      // Match the video's displayed box at device-pixel resolution for
      // crisp lines. Canvas is CSS-scaled back down to the same box, so it
      // overlays the video exactly regardless of DPR.
      const dpr = window.devicePixelRatio || 1
      const w = Math.round(video.clientWidth * dpr)
      const h = Math.round(video.clientHeight * dpr)
      if (!w || !h) return
      if (canvas.width !== w) canvas.width = w
      if (canvas.height !== h) canvas.height = h
      ctx.clearRect(0, 0, w, h)

      const ts = performance.now()
      if (ts <= lastTs) return
      lastTs = ts

      const result = detect(video, ts)
      for (const landmarks of result?.faceLandmarks ?? []) {
        utils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: 'rgba(120,230,255,0.4)', lineWidth: dpr }
        )
        for (const conn of CONTOURS) {
          utils.drawConnectors(landmarks, conn, {
            color: '#7fefff',
            lineWidth: 2 * dpr,
          })
        }
        for (const iris of IRISES) {
          utils.drawConnectors(landmarks, iris, {
            color: '#ffffff',
            lineWidth: 2 * dpr,
          })
        }
        utils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, {
          color: '#ff3f6c',
          lineWidth: 3 * dpr,
        })
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
