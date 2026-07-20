import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import DiscoverColors from '../pages/DiscoverColors'
import AnalyzingColors from '../pages/AnalyzingColors'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DiscoverColors />} />
        <Route path="/analyzing" element={<AnalyzingColors />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
