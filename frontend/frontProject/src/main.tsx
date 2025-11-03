import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// 1. Import AuthProvider
import { AuthProvider } from './context/AuthContext' 

// 2. Slick Carousel CSS (already present)
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// 3. Leaflet CSS for the map
import 'leaflet/dist/leaflet.css'; 

// 4. Your global CSS
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> 
      <App />
    </AuthProvider>
  </React.StrictMode>,
)