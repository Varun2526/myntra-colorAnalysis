import mockResult from '../mock/colorAnalysis.json'

/**
 * Returns the color-analysis result.
 * Mock-backed for now — when FastAPI lands, this becomes an
 * `api.post('/analyze', formData)` call with the same response shape.
 */
export function getAnalysisResult() {
  return mockResult
}
