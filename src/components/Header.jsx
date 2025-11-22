import React, { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/style.css'
import NeonTitle from './NeonTitle.jsx'
import gsap from 'gsap'

function Header({ onOpenChat, onToggleSidebar, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef(null)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Простая анимация при наведении для кнопок
  const animateButtonHover = (button, isHover) => {
    if (button) {
      gsap.to(button, {
        scale: isHover ? 1.05 : 1,
        duration: 0.2,
        ease: 'power2.out'
      })
    }
  }

  // Простая подсветка навигационных ссылок при наведении
  const handleNavHover = (e, isHover) => {
    e.currentTarget.style.color = isHover ? '#4fc3f7' : 'inherit'
    e.currentTarget.style.transform = isHover ? 'scale(1.05)' : 'scale(1)'
    e.currentTarget.style.transition = 'all 0.2s ease'
  }

  // Простая анимация кнопок без gsap
  const handleButtonHover = (e, isHover) => {
    const button = e.currentTarget
    if (isHover) {
      button.style.transform = 'translateY(-2px)'
      button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'
    } else {
      button.style.transform = 'translateY(0)'
      button.style.boxShadow = 'none'
    }
    button.style.transition = 'all 0.2s ease'
  }

  return (
    <header ref={navRef} className="header-animated">
      <button
        style ={{ fontSize: '24px', position: 'absolute', left: '15px', top: '30px' }}
        onClick={onToggleSidebar}
        className="sidebar-toggle"
      >
        ☰
      </button>


      <NeonTitle />

      <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link
              style = {{ position: 'relative', left: '4%'}}
                  
              to="/"
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >
              Главная
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >
              Настройки
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >
              О сайте
            </Link>
          </li>

          <li>
            <button
              onClick={onLogout}
              className="logout-button"
              onMouseEnter={(e) => animateButtonHover(e.currentTarget, true)}
              onMouseLeave={(e) => animateButtonHover(e.currentTarget, false)}
            >
              Выйти
            </button>
          </li>

          <li>
            <button
              onClick={onOpenChat}
              className="ai-button"
              onMouseEnter={(e) => {
                animateButtonHover(e.currentTarget, true)
                gsap.to(e.currentTarget, {
                  boxShadow: '0 0 15px rgba(79, 195, 247, 0.6)',
                  duration: 0.3,
                  ease: 'power2.out'
                })
              }}
              onMouseLeave={(e) => {
                animateButtonHover(e.currentTarget, false)
                gsap.to(e.currentTarget, {
                  boxShadow: '0 0 5px rgba(79, 195, 247, 0.3)',
                  duration: 0.3,
                  ease: 'power2.out'
                })
              }}
            >
              Ассистент ИИ
            </button>
          </li>
        </ul>
      </nav>
      
    </header>
  )
}

export default Header
