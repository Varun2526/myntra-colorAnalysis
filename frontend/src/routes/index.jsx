import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import DiscoverColors from '../pages/DiscoverColors'
import AnalyzingColors from '../pages/AnalyzingColors'
import Results from '../pages/Results'
import Preview from '../pages/Preview'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DiscoverColors />} />
        <Route path="/analyzing" element={<AnalyzingColors />} />
        <Route path="/results" element={<Results />} />
        <Route path="/preview" element={<Preview />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

