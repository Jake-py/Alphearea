import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PointsNotification, PointsInfo } from '../components/PointsNotification'
import { PointsReward, PointsToast } from '../components/PointsReward'
import usePoints from '../hooks/usePoints'

function PhilosophyWisdom() {
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
    navigate('/philosophy/wisdom/test')
  }

  return (
    <main className="lesson-page">
      <h2>Философия — Мудрости</h2>

      <PointsInfo 
        currentPoints={points}
        pointsForCompletion={15}
        description="Получайте points за каждый пройденный урок философии"
      />

      <section className="intro">
        <p>
          Философия - это любовь к мудрости. Здесь вы найдете классические идеи, 
          которые помогли сформировать наше понимание мира, морали и смысла жизни.
        </p>
      </section>

      <section className="module-block">
        <h3>Основные направления</h3>
        <ul>
          <li>Древнегреческая философия</li>
          <li>Средневековая философия</li>
          <li>Философия Просвещения</li>
          <li>Немецкая идеалистическая философия</li>
          <li>Современная философия</li>
          <li>Этика и мораль</li>
        </ul>
      </section>

      <section className="lesson-preview">
        <h3>Ключевые уроки</h3>
        <div className="cards">
          <article className="card">
            <h4>История западной философии</h4>
            <p>От Сократа до современности: основные этапы развития философии.</p>
            <PointsNotification pointsValue={15} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('philosophy-history', 'История западной философии')}
            >
              ✓ Завершить урок
            </button>
          </article>

          <article className="card">
            <h4>Метафизика и онтология</h4>
            <p>Вопросы о природе реальности и бытия.</p>
            <PointsNotification pointsValue={15} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('philosophy-metaphysics', 'Метафизика и онтология')}
            >
              ✓ Завершить урок
            </button>
          </article>

          <article className="card">
            <h4>Этика и мораль</h4>
            <p>Как мы должны жить? Что такое добро и зло?</p>
            <PointsNotification pointsValue={15} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('philosophy-ethics', 'Этика и мораль')}
            >
              ✓ Завершить урок
            </button>
          </article>
        </div>
      </section>

      <section className="practice">
        <h3>Практика</h3>
        <p>Проверьте свои знания философии:</p>

        <button className="btn-primary" onClick={handleStartTest}>
          🚀 Начать тест
        </button>
      </section>

      <PointsReward 
        isVisible={showReward}
        points={15}
        message={`Отлично! "${completedLesson}" завершен!`}
        onClose={() => setShowReward(false)}
      />

      <PointsToast 
        message="Вы получили points!"
        points={15}
        isVisible={showToast}
        type="success"
      />

      <section className="score-info">
        <div className="score-warning">
          <span className="warning-icon">ℹ️</span>
          <p>
            💡 Пройдите тест в разделе "Практика" выше, чтобы проверить свои знания и получить дополнительные points!
          </p>
        </div>
      </section>
    </main>
  )
}

export default PhilosophyWisdom
