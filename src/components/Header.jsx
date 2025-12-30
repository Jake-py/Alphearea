import React, { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/style.css'
import '../styles/pointsHeader.css'
import NeonTitle from './NeonTitle.jsx'
import PointsCounter from './PointsCounter.jsx'
import AuthButtons from './AuthButtons.jsx'
import useUser from '../hooks/useUser'
import { heavyAnimationsEnabled } from '../config/animations'

function Header({ onOpenChat, onToggleSidebar }) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef(null)
  const location = useLocation()
  const { userId } = useUser()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Простая анимация при наведении для кнопок
  const animateButtonHover = (button, isHover) => {
    if (!button) return;
    const enabled = heavyAnimationsEnabled();
    if (enabled) {
      // лёгкая трансформация
      button.style.transform = isHover ? 'scale(1.05)' : 'scale(1)'
    } else {
      button.style.transform = isHover ? 'scale(1.02)' : 'scale(1)'
    }
    button.style.transition = 'transform 0.2s ease';
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

      <PointsCounter />

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
              {t('header.home')}
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >
              {t('header.settings')}
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >
              {t('header.about')}
            </Link>
          </li>

          <li>
            <AuthButtons />
          </li>

          <li>
            <button
              onClick={onOpenChat}
              className="ai-button"
              onMouseEnter={(e) => {
                        animateButtonHover(e.currentTarget, true)
                        const enabled = heavyAnimationsEnabled();
                        e.currentTarget.style.boxShadow = enabled ? '0 0 10px rgba(79,195,247,0.6)' : 'none'
              }}
              onMouseLeave={(e) => {
                        animateButtonHover(e.currentTarget, false)
                        e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {t('header.aiAssistant')}
            </button>
          </li>
        </ul>
      </nav>
      
    </header>
  )
}

export default Header
