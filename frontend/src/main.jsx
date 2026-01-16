import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Userprovider from './GlobalContext/Userprovider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Userprovider>
      <App />
    </Userprovider>
    
  </StrictMode>,
)
