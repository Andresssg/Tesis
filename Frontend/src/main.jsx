import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RequestContextProvider } from './contexts/RequestContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RequestContextProvider>
      <App />
    </RequestContextProvider>
  </React.StrictMode>
)
