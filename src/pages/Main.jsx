// src/Main.jsx
import { useEffect, useState } from 'react'

function Main() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Auto-switch to dark mode after 2-3 minutes with fast-forward effect
    const timer = setTimeout(() => {
      setIsTransitioning(true)
      // Fast-forward animation speed during transition
      setTimeout(() => {
        setIsDarkMode(true)
        setIsTransitioning(false)
      }, 2000) // 2 second transition period
    }, 150000) // 2.5 minutes = 150 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`main-page ${isDarkMode ? 'dark-mode' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
      <h2>Добро пожаловать в Alphearea!</h2>
      <p>Выберите инструмент для учебы слева.</p>

      {/* TDS-Style Background Animation - Too Damn Smart */}
      <div className={`tds-bg-animation ${isDarkMode ? 'dark-mode' : ''} ${isTransitioning ? 'fast-forward' : ''}`}>
        {/* Neural Network Connections */}
        <div className="neural-network">
          <div className="node node-1"></div>
          <div className="node node-2"></div>
          <div className="node node-3"></div>
          <div className="node node-4"></div>
          <div className="node node-5"></div>
          <div className="node node-6"></div>
          <div className="node node-7"></div>
          <div className="node node-8"></div>
          <svg className="connections" viewBox="0 0 1000 600">
            <path d="M100,100 L300,150" className="connection-line line-1"></path>
            <path d="M300,150 L500,100" className="connection-line line-2"></path>
            <path d="M500,100 L700,200" className="connection-line line-3"></path>
            <path d="M100,200 L400,250" className="connection-line line-4"></path>
            <path d="M400,250 L600,300" className="connection-line line-5"></path>
            <path d="M200,300 L450,350" className="connection-line line-6"></path>
            <path d="M450,350 L650,400" className="connection-line line-7"></path>
            <path d="M300,400 L550,450" className="connection-line line-8"></path>
            <path d="M550,450 L750,500" className="connection-line line-9"></path>
          </svg>
        </div>

        {/* Data Streams */}
        <div className="data-streams">
          <div className="data-packet packet-1">010101</div>
          <div className="data-packet packet-2">TDS</div>
          <div className="data-packet packet-3">AI</div>
          <div className="data-packet packet-4">SMART</div>
          <div className="data-packet packet-5">010101</div>
        </div>

        {/* Intelligence Waves */}
        <div className="intelligence-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>

        {/* Smart Particles */}
        <div className="smart-particles">
          <div className="smart-particle particle-a"></div>
          <div className="smart-particle particle-b"></div>
          <div className="smart-particle particle-c"></div>
          <div className="smart-particle particle-d"></div>
          <div className="smart-particle particle-e"></div>
          <div className="smart-particle particle-f"></div>
        </div>

        {/* TDS Text Effect */}
        <div className="tds-text-bg">
          <span className="tds-letter t">T</span>
          <span className="tds-letter d">D</span>
          <span className="tds-letter s">S</span>
        </div>
      </div>
    </div>
  )
}

export default Main
