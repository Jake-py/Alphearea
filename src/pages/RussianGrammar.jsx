import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PointsNotification, PointsInfo } from '../components/PointsNotification'
import { PointsReward, PointsToast } from '../components/PointsReward'
import usePoints from '../hooks/usePoints'

function RussianGrammar() {
  const navigate = useNavigate()
  const username = JSON.parse(localStorage.getItem('user') || '{}').username || 'user'
  const { points, awardPoints } = usePoints(username)
  const [showReward, setShowReward] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [completedLesson, setCompletedLesson] = useState('')

  const handleLessonComplete = async (lessonId, lessonName) => {
    const result = await awardPoints('lesson', lessonId, 'beginner')
    
    if (result.success) {
      setCompletedLesson(lessonName)
      setShowReward(true)
      setShowToast(true)
    }
  }

  const handleStartTest = () => {
    navigate('/russian/grammar/test')
  }

  return (
    <main className="lesson-page">
      <h2>Русский язык — Грамматика</h2>

      <PointsInfo 
        currentPoints={points}
        pointsForCompletion={10}
        description="Получайте points за каждый пройденный урок грамматики"
      />

      <section className="intro">
        <p>
          Грамматика русского языка — одна из самых сложных в мире.
          Здесь вы сможете разобраться с падежами, спряжениями, видами глаголов и другими трудными аспектами русского языка.
        </p>
      </section>

      <section className="module-block">
        <h3>Основные темы</h3>
        <ul>
          <li>Шесть падежей русского языка</li>
          <li>Глагольные виды (совершенный и несовершенный)</li>
          <li>Спряжение глаголов</li>
          <li>Причастия и деепричастия</li>
          <li>Предлоги и их управление</li>
          <li>Пунктуация</li>
        </ul>
      </section>

      <section className="lesson-preview">
        <h3>Популярные уроки</h3>
        <div className="cards">
          <article className="card">
            <h4>Падежи существительных</h4>
            <p>Все шесть падежей русского языка и их употребление.</p>
            <PointsNotification pointsValue={10} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('russian-cases', 'Падежи существительных')}
            >
              ✓ Завершить урок
            </button>
          </article>

          <article className="card">
            <h4>Виды глаголов</h4>
            <p>Совершенный и несовершенный вид глаголов в русском.</p>
            <PointsNotification pointsValue={10} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('russian-aspects', 'Виды глаголов')}
            >
              ✓ Завершить урок
            </button>
          </article>

          <article className="card">
            <h4>Причастия</h4>
            <p>Полные и краткие причастия, их формы и употребление.</p>
            <PointsNotification pointsValue={10} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('russian-participles', 'Причастия')}
            >
              ✓ Завершить урок
            </button>
          </article>
        </div>
      </section>

      <section className="practice">
        <h3>Практика</h3>
        <p>Пройдите короткий тест, чтобы закрепить знания:</p>

        <button className="btn-primary" onClick={handleStartTest}>
          🚀 Начать тест
        </button>
      </section>

      <PointsReward 
        isVisible={showReward}
        points={10}
        message={`Отлично! "${completedLesson}" завершен!`}
        onClose={() => setShowReward(false)}
      />

      <PointsToast 
        message="Вы получили points!"
        points={10}
        isVisible={showToast}
        type="success"
      />

      <section className="score-info">
        <div className="score-warning">
          <span className="warning-icon">ℹ️</span>
          <p>
            💡 Пройдите тест в разделе "Практика" выше, чтобы закрепить знания и получить дополнительные points!
          </p>
        </div>
      </section>
    </main>
  )
}

export default RussianGrammar
