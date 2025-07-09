import { useState } from 'react'

import './App.css'
import { appRouter } from './routes/appRouter.jsx'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
function App() {

  
  return (
    <main>
    <ThemeProvider>
    <RouterProvider router={appRouter}/>
    </ThemeProvider>
    </main>
  )
}

export default App
