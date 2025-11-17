import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/style.css'

function TDS() {
  return (
    <main>
      <div className="tds-page">
        <h2>TDS (Too Damn Smart)</h2>
        <p className="tds-description">
          Интеллектуальная платформа для тестирования и анализа знаний.
          Здесь технологии работают не вместо человека, а вместе с ним.
        </p>

        <div className="tds-features">
          <div className="feature-card">
            <h3>🎯 Интеллектуальное Тестирование</h3>
            <p>
              Система TDS использует продвинутые алгоритмы для создания персонализированных тестов,
              адаптирующихся к уровню знаний пользователя.
            </p>
          </div>

          <div className="feature-card">
            <h3>📊 Анализ Прогресса</h3>
            <p>
              Детальная статистика и аналитика помогают отслеживать развитие навыков
              и выявлять области, требующие дополнительного внимания.
            </p>
          </div>

          <div className="feature-card">
            <h3>🤖 ИИ-Ассистент</h3>
            <p>
              Интегрированный ИИ помогает в создании контента, анализе ответов
              и предоставлении персонализированных рекомендаций.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔄 Адаптивное Обучение</h3>
            <p>
              Платформа автоматически корректирует сложность заданий на основе
              предыдущих результатов и скорости обучения.
            </p>
          </div>
        </div>

        <div className="tds-actions">
          <Link to="/test-creator" className="tds-button primary">
            Создать Тест
          </Link>
          <Link to="/test-settings" className="tds-button secondary">
            Настройки Тестирования
          </Link>
          <Link to="/smart-editor" className="tds-button secondary">
            Smart Editor
          </Link>
        </div>

        <div className="tds-stats">
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Созданных Тестов</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5000+</span>
            <span className="stat-label">Пройденных Тестов</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">95%</span>
            <span className="stat-label">Точность Анализа</span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TDS
