import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/style.css'
import NeonTitle from './NeonTitle.jsx'

function Header({ onOpenChat }) {
  return (
    <header>
      <NeonTitle />
      <nav>
        <ul>
          <li><Link to="/about">О сайте</Link></li>
          <li><Link to="/settings">Настройки профиля</Link></li>
          <li><button onClick={onOpenChat} className="ai-button">Ассистент ИИ</button></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
