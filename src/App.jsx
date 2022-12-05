import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Outlet } from 'react-router-dom';
import Navbar from './navbar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <div className="App">
        <Navbar />
        <Outlet />
      </div>
    </>
  )
}

export default App
