import api from './api'
import mockResult from '../mock/colorAnalysis.json'

// Dev toggle: set VITE_USE_MOCK_ANALYSIS=true in frontend/.env to work on the
// UI without the backend running. Defaults to the real API.
const USE_MOCK = import.meta.env.VITE_USE_MOCK_ANALYSIS === 'true'

const MOCK_DELAY_MS = 1200

/**
 * Runs the color analysis for an uploaded selfie.
 * Returns the analysis JSON (same shape from mock and real backend).
 * Throws an Error with a user-readable `message` on failure.
 */
export async function analyzeImage(file) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
    return mockResult
  }

  const formData = new FormData()
  formData.append('image', file)

  try {
    const { data } = await api.post('/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (error) {
    const detail = error.response?.data?.detail
    throw new Error(
      typeof detail === 'string'
        ? detail
        : 'Analysis failed. Please check that the backend is running and try again.',
      { cause: error }
    )
  }
}
