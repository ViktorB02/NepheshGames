import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode is intentionally off: its dev-only double effect run breaks the
// lifecycle of drei's <Html> roots (hotspot markers go missing after route changes).
createRoot(document.getElementById('root')).render(<App />)
