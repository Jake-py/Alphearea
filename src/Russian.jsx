import { Link } from 'react-router-dom'

function Russian() {
  return (
    <main>
      <h2>Русский язык</h2>
      <div className="subject-blocks">
        <div className="block">
          <h3>Грамматика</h3>
          <p>Изучите правила русского языка</p>
          <Link to="/russian/grammar" className="block-link">Перейти</Link>
        </div>
        <div className="block">
          <h3>Диалоги</h3>
          <p>Практика разговорного русского</p>
          <Link to="/russian/dialogues" className="block-link">Перейти</Link>
        </div>
        <div className="block">
          <h3>Курсы</h3>
          <p>Структурированное обучение</p>
          <Link to="/russian/courses" className="block-link">Перейти</Link>
        </div>
      </div>
    </main>
  )
}

export default Russian
