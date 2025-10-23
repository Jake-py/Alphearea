import { Link } from 'react-router-dom'

function Psychology() {
  return (
    <main>
      <h2>Психология</h2>
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
