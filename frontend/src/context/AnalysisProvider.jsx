import { useCallback, useMemo, useState } from 'react'
import { AnalysisContext } from './analysis-context'

/**
 * Carries the selected selfie and its analysis result across the flow
 * (upload → analyzing → results).
 */
function AnalysisProvider({ children }) {
  const [image, setImage] = useState(null) // { file, previewUrl }
  const [result, setResult] = useState(null) // AnalysisResponse JSON

  const startAnalysis = useCallback((file) => {
    setImage({ file, previewUrl: URL.createObjectURL(file) })
    setResult(null)
  }, [])

  const reset = useCallback(() => {
    setImage((current) => {
      if (current?.previewUrl) URL.revokeObjectURL(current.previewUrl)
      return null
    })
    setResult(null)
  }, [])

  const value = useMemo(
    () => ({ image, result, setResult, startAnalysis, reset }),
    [image, result, startAnalysis, reset]
  )

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
}

export default AnalysisProvider
