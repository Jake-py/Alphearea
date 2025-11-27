import { Link } from 'react-router-dom'
import { PointsInfo } from '../components/PointsNotification'
import usePoints from '../hooks/usePoints'

function Psychology() {
  const username = JSON.parse(localStorage.getItem('user') || '{}').username || 'user'
  const { points } = usePoints(username)

  return (
    <main>
      <h2>Психология</h2>
      
      <PointsInfo 
        currentPoints={points}
        pointsForCompletion={15}
        description="Получайте points при изучении теорий и практик психологии"
      />
      
      <div className="subject-blocks">
        <div className="block">
          <h3>Теории</h3>
          <p>Психологические концепции и теории</p>
          <Link to="/psychology/theories" className="block-link">Перейти</Link>
        </div>
        <div className="block">
          <h3>Практики</h3>
          <p>Упражнения и методы самопознания</p>
          <Link to="/psychology/practices" className="block-link">Перейти</Link>
        </div>
      </div>
    </main>
  )
}

export default Psychology
