import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PointsNotification, PointsInfo } from '../components/PointsNotification'
import { PointsReward, PointsToast } from '../components/PointsReward'
import usePoints from '../hooks/usePoints'

function EnglishGrammar() {
  const navigate = useNavigate()
  const username = JSON.parse(localStorage.getItem('user') || '{}').username || 'user'
  const { points, awardPoints } = usePoints(username)
  const [showReward, setShowReward] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [completedLesson, setCompletedLesson] = useState('')

  const handleLessonComplete = async (lessonId, lessonName) => {
    // Начисляем points за прохождение урока
    const difficulty = lessonId === 'english-grammar-complete' ? 'advanced' : 'beginner'
    const result = await awardPoints('lesson', lessonId, difficulty)

    if (result.success) {
      setCompletedLesson(lessonName)
      setShowReward(true)
      setShowToast(true)
    }
  }

  const handleStartTest = () => {
    navigate('/english/grammar/test')
  }

  return (
    <main className="lesson-page">
      <h2>Английский язык — Грамматика</h2>

      <PointsInfo 
        currentPoints={points}
        pointsForCompletion={10}
        description="Получайте points за каждый пройденный урок грамматики"
      />

      <section className="intro">
        <p>
          Грамматика — фундамент английского языка. Здесь вы сможете изучить времена,
          артикли, местоимения, предлоги и другие ключевые правила, необходимые для правильного построения предложений.
        </p>
        <p>
          В разделе собраны уроки, таблицы, интерактивные задания и примеры,
          которые помогут не просто понять теорию, но и закрепить её на практике.
        </p>
      </section>

      <section className="module-block">
        <h3>Основные темы</h3>
        <ul>
          <li>Времена английского языка</li>
          <li>Артикли: a, an, the</li>
          <li>Местоимения</li>
          <li>Предлоги</li>
          <li>Степени сравнения прилагательных</li>
          <li>Пассивный залог</li>
        </ul>
      </section>

      <section className="lesson-preview">
        <h3>Популярные уроки</h3>
        <div className="cards">
          <article className="card">
            <h4>Present Simple</h4>
            <p>Когда используется и как правильно строить предложения.</p>
          </article>

          <article className="card">
            <h4>Past Continuous</h4>
            <p>Как описывать действия, которые длились в прошлом.</p>
          </article>

          <article className="card">
            <h4>Артикли</h4>
            <p>Как понять, какой артикль использовать в разных ситуациях.</p>
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

      <section className="completion">
        <h3>Завершение раздела</h3>
        <p>После изучения уроков и прохождения теста, отметьте завершение раздела грамматики:</p>
        <PointsNotification pointsValue={30} description="За завершение раздела грамматики" />
        <button
          className="complete-btn"
          onClick={() => handleLessonComplete('english-grammar-complete', 'Английская грамматика')}
        >
          ✓ Завершить урок
        </button>
      </section>

      {/* Компоненты для отображения награды */}
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
  );
}

export default EnglishGrammar;
