import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;