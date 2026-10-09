import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { S, tileUrl } from './game/sprites'

// Preload every sprite so scenes never flash empty on first view
Object.values(S).forEach((ref) => {
  const img = new Image()
  img.src = tileUrl(ref)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
