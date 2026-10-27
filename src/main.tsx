import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { unlockGlobalAudio } from './utils/audio.ts'

// Global user-gesture audio unlocker for mobile Chrome and Safari
if (typeof window !== 'undefined') {
  const handleInteraction = () => {
    unlockGlobalAudio()
  }
  window.addEventListener('click', handleInteraction, { passive: true })
  window.addEventListener('touchstart', handleInteraction, { passive: true })
  window.addEventListener('keydown', handleInteraction, { passive: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
