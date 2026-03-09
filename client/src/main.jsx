import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Silence browser console output in production builds.
if (import.meta.env.MODE === 'production') {
  console.log = () => { };
  console.error = () => { };
  console.debug = () => { };
}

// Mount the React application to the root DOM node.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
