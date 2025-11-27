import React from 'react'
import { Link } from 'react-router-dom'
import { PointsInfo } from '../components/PointsNotification'
import usePoints from '../hooks/usePoints'
import '../styles/Electronics.css'

function Electronics() {
  const username = JSON.parse(localStorage.getItem('user') || '{}').username || 'user'
  const { points } = usePoints(username)

  return (
    <div className="electronics-page">
      <div className="electronics-content">
        <h1 className="page-title">Электроника</h1>
        
        <PointsInfo 
          currentPoints={points}
          pointsForCompletion={18}
          description="Получайте points при изучении электроники и прохождении практических курсов"
        />
        
        <p className="page-description">
          Освойте основы электроники, схемотехнику и микроэлектронику. От теории к практике.
        </p>
        
        <div className="electronics-sections">
          <div className="section-card">
            <h2>Основы электроники</h2>
            <p>Электрические цепи, законы Ома, базовые компоненты</p>
            <Link to="/electronics/basics" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Электронные компоненты</h2>
            <p>Резисторы, конденсаторы, транзисторы, микросхемы</p>
            <Link to="/electronics/components" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Цифровая электроника</h2>
            <p>Логические вентили, микроконтроллеры, ПЛИС</p>
            <Link to="/electronics/digital" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Аналоговая электроника</h2>
            <p>Усилители, фильтры, генераторы сигналов</p>
            <Link to="/electronics/analog" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Практические схемы</h2>
            <p>Сборка реальных устройств и проектов</p>
            <Link to="/electronics/circuits" className="section-link">Создавать</Link>
          </div>
          
          <div className="section-card">
            <h2>Arduino и Raspberry Pi</h2>
            <p>Микроконтроллеры и одноплатные компьютеры</p>
            <Link to="/electronics/microcontrollers" className="section-link">Изучить</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Electronics
