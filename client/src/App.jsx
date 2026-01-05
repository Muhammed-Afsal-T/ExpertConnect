import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login'; 
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import ExpertHome from './pages/Expert/ExpertHome'; 
import ExpertProfile from './pages/Expert/ExpertProfile';
import UserDashboard from './pages/User/UserDashboard';
import UserProfile from './pages/User/UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/" element={<Login />} />
        <Route path="/expert-dashboard" element={<ExpertHome />} />
        <Route path="/expert/profile" element={<ExpertProfile />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;