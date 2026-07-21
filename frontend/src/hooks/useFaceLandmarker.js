import { useCallback, useEffect, useRef, useState } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

// WASM runtime + model are hosted locally under public/ so the demo works
// offline (no CDN dependency). Version pinned to match the installed package.
const WASM_PATH = '/mediapipe/wasm'
const MODEL_PATH = '/models/face_landmarker.task'

// The landmarker is expensive to create, so build it once and share it.
let _landmarkerPromise = null

function loadLandmarker() {
  if (!_landmarkerPromise) {
    _landmarkerPromise = (async () => {
      const fileset = await FilesetResolver.forVisionTasks(WASM_PATH)
      return FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_PATH },
        runningMode: 'VIDEO',
        numFaces: 1,
      })
    })()
  }
  return _landmarkerPromise
}

/**
 * Loads MediaPipe Face Landmarker (JS Tasks Vision) for LIVE VISUALIZATION only.
 * This detects landmarks for the on-screen mesh — it does not predict
 * undertone/season/palettes; that stays exclusively in the backend.
 */
function useFaceLandmarker(enabled) {
  const [ready, setReady] = useState(false)
  const landmarkerRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    let cancelled = false
    loadLandmarker()
      .then((landmarker) => {
        if (cancelled) return
        landmarkerRef.current = landmarker
        setReady(true)
      })
      .catch(() => setReady(false))
    return () => {
      cancelled = true
    }
  }, [enabled])

  const detect = useCallback((video, timestampMs) => {
    if (!landmarkerRef.current) return null
    return landmarkerRef.current.detectForVideo(video, timestampMs)
  }, [])

  return { ready, detect }
}

export default useFaceLandmarker
