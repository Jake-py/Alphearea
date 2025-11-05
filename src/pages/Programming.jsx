import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Programming.css'

function Programming() {
  return (
    <div className="programming-page">
      <div className="programming-content">
        <h1 className="page-title">Программирование</h1>
        <p className="page-description">
          Изучайте программирование от основ до продвинутых концепций. Практические проекты и современные технологии.
        </p>
        
        <div className="programming-sections">
          <div className="section-card">
            <h2>Основы программирования</h2>
            <p>Алгоритмы, структуры данных, основы кодирования</p>
            <Link to="/programming/basics" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Веб-разработка</h2>
            <p>HTML, CSS, JavaScript, React, Node.js</p>
            <Link to="/programming/web" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Языки программирования</h2>
            <p>Python, Java, C++, JavaScript и другие</p>
            <Link to="/programming/languages" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Базы данных</h2>
            <p>SQL, NoSQL, проектирование баз данных</p>
            <Link to="/programming/databases" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Мобильная разработка</h2>
            <p>iOS, Android, React Native, Flutter</p>
            <Link to="/programming/mobile" className="section-link">Изучить</Link>
          </div>
          
          <div className="section-card">
            <h2>Практические проекты</h2>
            <p>Реальные проекты для портфолио</p>
            <Link to="/programming/projects" className="section-link">Создавать</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Programming
