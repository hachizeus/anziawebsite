import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

// Lazy load the App component for better initial load performance
const App = lazy(() => import('./App.jsx'))

// Preload critical components
import('./components/Hero').catch(console.error)
import('./components/Navbar').catch(console.error)

console.log('Environment variables loaded: ', {
  API_URL: import.meta.env.VITE_API_BASE_URL
})

// Loading indicator
const LoadingFallback = () => (
  <div className="app-loading">
    <div className="loading-spinner"></div>
    <p>Loading Anzia Electronics ...</p>
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)

