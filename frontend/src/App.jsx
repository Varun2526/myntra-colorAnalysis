import AnalysisProvider from './context/AnalysisProvider'
import AppRoutes from './routes'

function App() {
  return (
    <AnalysisProvider>
      <AppRoutes />
    </AnalysisProvider>
  )
}

export default App
