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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/expert-dashboard" element={<ExpertHome />} />
        <Route path="/expert/profile" element={<ExpertProfile />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/book-expert/:id" element={<ExpertDetails />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/expert/chat" element={<ExpertChat />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/video-call/:bookingId" element={<VideoCall />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;