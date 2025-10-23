import { Link } from 'react-router-dom'

function Korean() {
  return (
    <main>
      <h2>Корейский язык</h2>
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
