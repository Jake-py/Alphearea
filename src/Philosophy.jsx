import { Link } from 'react-router-dom'

function Philosophy() {
  return (
    <main>
      <h2>Философия</h2>
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
