import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/typography.css'
import './styles/typography-overrides.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
