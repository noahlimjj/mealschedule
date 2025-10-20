import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MealProvider } from './context/MealContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MealProvider>
      <App />
    </MealProvider>
  </StrictMode>,
)
