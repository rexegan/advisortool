import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import WaterApp from './WaterApp.tsx'
import BlueCheck from './bluecheck/BlueCheck.tsx'

const path = window.location.pathname;
const isWater = path.startsWith('/water');
const isBlueCheck = path.startsWith('/bluecheck');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isBlueCheck ? <BlueCheck /> : isWater ? <WaterApp /> : <App />}
  </StrictMode>,
)
