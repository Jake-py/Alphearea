import React from 'react'
import './style.css'
import NeonTitle from './NeonTitle.jsx'

function Header() {
  return (
    <header>
      <NeonTitle />
      <nav>
        <ul>
          <li><a href="#">О сайте</a></li>
          <li><a href="#">Настройки профиля</a></li>
          <li><a href="#">Настройка ИИ</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
