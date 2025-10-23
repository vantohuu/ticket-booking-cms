import { BrowserRouter, Routes, Route } from "react-router-dom"
import MoviePage from "../src/containers/Movie/Loadable"
import RoomPage from "../src/containers/Room/Loadable"
import SeatMapPage from "../src/containers/SeatMap/Loadable"
import CinemaPage from "../src/containers/Cinema/Loadable"
import ShowtimePage from "../src/containers/Showtime/Loadable"
import LoginPage from "../src/containers/Login/index"
import NotFoundPage from "../src/containers/NotFound/index"
import PrivateRoute from "../src/components/PrivateRoute"
import ManagerRoute from "../src/components/ManagerRoute"
import SeatManagementPage from "./containers/SeatManagement/Loadable"
import QRPage from "./containers/QR/index"
import ProfilePage from "./containers/Profile/Loadable"
import ReportPage from "./containers/Report/Loadable"
import UnauthorizedPage from "./containers/Unauthorized/index"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected - STAFF and MANAGER can access */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<QRPage />} />
          <Route path="/seat-management" element={<SeatManagementPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<ManagerRoute />}>
          <Route path="/movie" element={<MoviePage />} />
          <Route path="/cinema" element={<CinemaPage />} />
          <Route path="/room" element={<RoomPage />} />
          <Route path="/seat-map" element={<SeatMapPage />} />
          <Route path="/showtime" element={<ShowtimePage />} />
          <Route path="/reports" element={<ReportPage />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
