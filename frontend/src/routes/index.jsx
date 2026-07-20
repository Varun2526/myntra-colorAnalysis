import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import DiscoverColors from '../pages/DiscoverColors'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DiscoverColors />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
