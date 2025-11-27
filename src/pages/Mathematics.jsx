import React from 'react'
import { Link } from 'react-router-dom'
import { PointsInfo } from '../components/PointsNotification'
import usePoints from '../hooks/usePoints'
import '../styles/Mathematics.css'

function Mathematics() {
  const username = JSON.parse(localStorage.getItem('user') || '{}').username || 'user'
  const { points } = usePoints(username)

  return (
    <div className="mathematics-page">
      <div className="mathematics-content">
        <h1 className="page-title">Математика</h1>
        
        <PointsInfo 
          currentPoints={points}
          pointsForCompletion={12}
          description="Получайте points при решении задач и завершении курсов математики"
        />
        
        <p className="page-description">
          Изучайте математику от основ до высших разделов. Интерактивные уроки, задачи и тесты.
        </p>
        
        <div className="mathematics-sections">
          <div className="section-card">
            <h2>Основы математики</h2>
            <p>Арифметика, алгебра, геометрия для начинающих</p>
            <Link to="/mathematics/basics" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Высшая математика</h2>
            <p>Математический анализ, линейная алгебра, теория вероятностей</p>
            <Link to="/mathematics/advanced" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Прикладная математика</h2>
            <p>Статистика, численные методы, оптимизация</p>
            <Link to="/mathematics/applied" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Математические задачи</h2>
            <p>Практические задания и олимпиадные задачи</p>
            <Link to="/mathematics/problems" className="section-link">Решать</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mathematics
