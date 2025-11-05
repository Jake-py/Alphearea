import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/style.css'
import NeonTitle from './NeonTitle.jsx'

function Header({ onOpenChat, onToggleSidebar, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header>
      <button onClick={onToggleSidebar} className="sidebar-toggle">☰</button>
      <NeonTitle />
      <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Главная</Link></li>
          <li><Link to="/test-settings" onClick={() => setIsMenuOpen(false)}>Тесты</Link></li>
          <li><Link to="/test-creator" onClick={() => setIsMenuOpen(false)}>TDS</Link></li>
          <li><Link to="/settings" onClick={() => setIsMenuOpen(false)}>Настройки</Link></li>
          <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>О сайте</Link></li>
          <li><button onClick={onLogout} className="logout-button">Выйти</button></li>
          <li><button onClick={onOpenChat} className="ai-button">Ассистент ИИ</button></li>
        </ul>
      </nav>
      <button className="mobile-menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
    </header>
  )
}

export default Header
