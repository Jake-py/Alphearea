import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PointsNotification, PointsInfo } from '../components/PointsNotification'
import { PointsReward, PointsToast } from '../components/PointsReward'
import usePoints from '../hooks/usePoints'

function PsychologyTheories() {
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
    navigate('/psychology/theories/test')
  }

  return (
    <main className="lesson-page">
      <h2>Психология — Теории</h2>

      <PointsInfo 
        currentPoints={points}
        pointsForCompletion={15}
        description="Получайте points за каждый пройденный урок психологии"
      />

      <section className="intro">
        <p>
          Психология изучает человеческое поведение и сознание. 
          Здесь вы узнаете о ключевых теориях, которые помогли нам понять, как мы думаем, чувствуем и ведем себя.
        </p>
      </section>

      <section className="module-block">
        <h3>Основные школы психологии</h3>
        <ul>
          <li>Психоанализ Фрейда</li>
          <li>Бихевиоризм</li>
          <li>Когнитивная психология</li>
          <li>Гуманистическая психология</li>
          <li>Экзистенциальная психология</li>
          <li>Социальная психология</li>
        </ul>
      </section>

      <section className="lesson-preview">
        <h3>Важные теории</h3>
        <div className="cards">
          <article className="card">
            <h4>Психоанализ Фрейда</h4>
            <p>Основополагающая теория о бессознательном и психических конфликтах.</p>
            <PointsNotification pointsValue={15} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('psychology-freud', 'Психоанализ Фрейда')}
            >
              ✓ Завершить урок
            </button>
          </article>

          <article className="card">
            <h4>Когнитивная психология</h4>
            <p>Как мы обрабатываем информацию и формируем убеждения.</p>
            <PointsNotification pointsValue={15} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('psychology-cognitive', 'Когнитивная психология')}
            >
              ✓ Завершить урок
            </button>
          </article>

          <article className="card">
            <h4>Теория иерархии потребностей</h4>
            <p>Маслоу о том, что мотивирует человеческое поведение.</p>
            <PointsNotification pointsValue={15} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('psychology-maslow', 'Теория иерархии потребностей')}
            >
              ✓ Завершить урок
            </button>
          </article>
        </div>
      </section>

      <section className="practice">
        <h3>Практика</h3>
        <p>Проверьте свои знания психологических теорий:</p>

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

export default PsychologyTheories
