import { Link } from 'react-router-dom'
import { PointsInfo } from '../components/PointsNotification'
import usePoints from '../hooks/usePoints'

function Korean() {
  const username = JSON.parse(localStorage.getItem('user') || '{}').username || 'user'
  const { points } = usePoints(username)

  return (
    <main>
      <h2>Корейский язык</h2>
      
      <PointsInfo 
        currentPoints={points}
        pointsForCompletion={10}
        description="Получайте points при прохождении уроков, выполнении тестов и завершении курсов"
      />
      
      <div className="subject-blocks">
        <div className="block">
          <h3>Грамматика</h3>
          <p>Изучите правила корейского языка</p>
          <Link to="/korean/grammar" className="block-link">Перейти</Link>
        </div>
        <div className="block">
          <h3>Диалоги</h3>
          <p>Практика разговорного корейского</p>
          <Link to="/korean/dialogues" className="block-link">Перейти</Link>
        </div>
        <div className="block">
          <h3>Курсы</h3>
          <p>Структурированное обучение</p>
          <Link to="/korean/courses" className="block-link">Перейти</Link>
        </div>
      </div>
    </main>
  )
}

export default Korean
