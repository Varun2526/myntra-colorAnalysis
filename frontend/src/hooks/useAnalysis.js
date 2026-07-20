import { useContext } from 'react'
import { AnalysisContext } from '../context/analysis-context'

/** Access the color-analysis flow state. Must be used under AnalysisProvider. */
function useAnalysis() {
  const ctx = useContext(AnalysisContext)
  if (!ctx) {
    throw new Error('useAnalysis must be used within an AnalysisProvider')
  }
  return ctx
}

export default useAnalysis
