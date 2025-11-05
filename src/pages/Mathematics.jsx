import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Mathematics.css'

function Mathematics() {
  return (
    <div className="mathematics-page">
      <div className="mathematics-content">
        <h1 className="page-title">Математика</h1>
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
