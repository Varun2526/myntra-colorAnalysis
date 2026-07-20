import { useCallback, useMemo, useState } from 'react'
import { AnalysisContext } from './analysis-context'

/**
 * Carries the selected selfie across the flow (upload → analyzing → results).
 * `image.file` is what gets POSTed to the backend in a later phase.
 */
function AnalysisProvider({ children }) {
  const [image, setImage] = useState(null) // { file, previewUrl }

  const startAnalysis = useCallback((file) => {
    setImage({ file, previewUrl: URL.createObjectURL(file) })
  }, [])

  const reset = useCallback(() => {
    setImage((current) => {
      if (current?.previewUrl) URL.revokeObjectURL(current.previewUrl)
      return null
    })
  }, [])

  const value = useMemo(
    () => ({ image, startAnalysis, reset }),
    [image, startAnalysis, reset]
  )

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
}

export default AnalysisProvider
