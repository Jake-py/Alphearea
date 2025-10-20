import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './style.css'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import Main from './Main.jsx'
import NeonTitle from './NeonTitle.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'red_ice' && password === 'password') {
      setIsLoggedIn(true)
    } else {
      setError('Invalid credentials')
    }
  }

  if (!isLoggedIn) {
    return (
      <div id="login-container">
        <NeonTitle tag="h2" />
        <form id="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p id="error-message" style={{ color: 'red', display: error ? 'block' : 'none' }}>
          {error}
        </p>
      </div>
    )
  }

  return (
    <Router>
      <div id="main-container">
        <Header />
        <div className="content">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/english" element={<div><h2>Английский язык</h2><p>Контент для английского языка</p></div>} />
            <Route path="/psychology" element={<div><h2>Психология</h2><p>Контент для психологии</p></div>} />
            <Route path="/philosophy" element={<div><h2>Философия</h2><p>Контент для философии</p></div>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
