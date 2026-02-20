import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ExpertHome from './pages/Expert/ExpertHome';
import ExpertProfile from './pages/Expert/ExpertProfile';
import UserDashboard from './pages/User/UserDashboard';
import UserProfile from './pages/User/UserProfile';
import ExpertDetails from './pages/User/ExpertDetails';
import Chat from './pages/Chat/Chat';
import ExpertChat from './pages/Chat/ExpertChat';
import VideoCall from './pages/Chat/VideoCall';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import LandingPage from './pages/LandingPage/LandingPage';
import BookingHistory from './pages/User/BookingHistory';
import AdminReports from './pages/Admin/AdminReports';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import PublicRoute from './components/Routes/PublicRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin-reports" element={
          <ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>
        } />

        {/* Expert Routes */}
        <Route path="/expert-dashboard" element={
          <ProtectedRoute allowedRoles={['expert']}><ExpertHome /></ProtectedRoute>
        } />
        <Route path="/expert/profile" element={
          <ProtectedRoute allowedRoles={['expert']}><ExpertProfile /></ProtectedRoute>
        } />
        <Route path="/expert/chat" element={
          <ProtectedRoute allowedRoles={['expert']}><ExpertChat /></ProtectedRoute>
        } />

        {/* User Routes */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user']}><UserProfile /></ProtectedRoute>
        } />
        <Route path="/book-expert/:id" element={
          <ProtectedRoute allowedRoles={['user']}><ExpertDetails /></ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute allowedRoles={['user']}><Chat /></ProtectedRoute>
        } />
        <Route path="/booking-history" element={
          <ProtectedRoute allowedRoles={['user']}><BookingHistory /></ProtectedRoute>
        } />
        <Route path="/video-call/:bookingId" element={
          <ProtectedRoute allowedRoles={['user', 'expert']}><VideoCall /></ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;