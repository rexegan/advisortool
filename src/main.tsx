import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import WaterApp from './WaterApp.tsx'

const isWater = window.location.pathname.startsWith('/water');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isWater ? <WaterApp /> : <App />}
  </StrictMode>,
)
