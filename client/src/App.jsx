import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login'; 
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import ExpertHome from './pages/Expert/ExpertHome'; 
import ExpertProfile from './pages/Expert/ExpertProfile';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;