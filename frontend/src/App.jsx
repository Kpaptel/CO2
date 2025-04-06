import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./pages/Home.jsx"
import Navbar from './components/Navbar.jsx';
import About from './pages/About.jsx';
import Help from './pages/Help.jsx';
import Logo from './components/Logo.jsx';
import Impact from './pages/Impact.jsx';


function App() {
  return (
    <Router>
      <Logo/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/impact" element={<Impact/>} />
        <Route path="/help" element={<div>Help</div>} />
      </Routes>  
    </Router>
  )
}

export default App
