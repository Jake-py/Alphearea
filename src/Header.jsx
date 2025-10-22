import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'
import NeonTitle from './NeonTitle.jsx'

function Header() {
  return (
    <header>
      <NeonTitle />
      <nav>
        <ul>
          <li><Link to="/about">О сайте</Link></li>
          <li><Link to="/settings">Настройки профиля</Link></li>
          <li><a href="#">Настройка ИИ</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
