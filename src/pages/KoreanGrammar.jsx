import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PointsNotification, PointsInfo } from '../components/PointsNotification'
import { PointsReward, PointsToast } from '../components/PointsReward'
import usePoints from '../hooks/usePoints'

function KoreanGrammar() {
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
    navigate('/korean/grammar/test')
  }

  return (
    <main className="lesson-page">
      <h2>Корейский язык — Грамматика</h2>

      <PointsInfo 
        currentPoints={points}
        pointsForCompletion={10}
        description="Получайте points за каждый пройденный урок грамматики"
      />

      <section className="intro">
        <p>
          Грамматика корейского языка отличается своей стройностью и логичностью.
          Здесь вы сможете изучить основные грамматические конструкции, служебные частицы, глагольные спряжения и другие ключевые элементы языка.
        </p>
      </section>

      <section className="module-block">
        <h3>Основные темы</h3>
        <ul>
          <li>Служебные частицы (-이/가, -을/를, -에서, -으로)</li>
          <li>Глагольное спряжение</li>
          <li>Прошедшее и будущее время</li>
          <li>Условное наклонение</li>
          <li>Пассивный и каузативный залог</li>
          <li>Причастия и деепричастия</li>
        </ul>
      </section>

      <section className="lesson-preview">
        <h3>Популярные уроки</h3>
        <div className="cards">
          <article className="card">
            <h4>Служебные частицы</h4>
            <p>Основные грамматические частицы корейского языка.</p>
            <PointsNotification pointsValue={10} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('korean-particles', 'Служебные частицы')}
            >
              ✓ Завершить урок
            </button>
          </article>

          <article className="card">
            <h4>Спряжение глаголов</h4>
            <p>Как спрягаются глаголы в разных временах и лицах.</p>
            <PointsNotification pointsValue={10} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('korean-verbs', 'Спряжение глаголов')}
            >
              ✓ Завершить урок
            </button>
          </article>

          <article className="card">
            <h4>Пассивный залог</h4>
            <p>Как строятся пассивные конструкции в корейском.</p>
            <PointsNotification pointsValue={10} description="За прохождение этого урока" />
            <button 
              className="complete-btn"
              onClick={() => handleLessonComplete('korean-passive', 'Пассивный залог')}
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

export default KoreanGrammar
