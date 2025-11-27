import { Link } from 'react-router-dom'
import { PointsInfo } from '../components/PointsNotification'
import usePoints from '../hooks/usePoints'

function Philosophy() {
  const username = JSON.parse(localStorage.getItem('user') || '{}').username || 'user'
  const { points } = usePoints(username)

  return (
    <main>
      <h2>Философия</h2>
      
      <PointsInfo 
        currentPoints={points}
        pointsForCompletion={15}
        description="Получайте points при изучении философских теорий и книг"
      />
      
      <div className="subject-blocks">
        <div className="block">
          <h3>Книги</h3>
          <p>Рекомендуемая литература по философии</p>
          <Link to="/philosophy/books" className="block-link">Перейти</Link>
        </div>
        <div className="block">
          <h3>Мудрость</h3>
          <p>Цитаты, афоризмы и мудрости</p>
          <Link to="/philosophy/wisdom" className="block-link">Перейти</Link>
        </div>
      </div>
    </main>
  )
}

export default Philosophy
