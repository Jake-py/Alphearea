import { Link } from 'react-router-dom'

function English() {
  return (
    <main>
      <h2>Английский язык</h2>
      <div className="subject-blocks">
        <div className="block">
          <h3>Грамматика</h3>
          <p>Изучите правила английской грамматики</p>
          <Link to="/english/grammar" className="block-link">Перейти</Link>
        </div>
        <div className="block">
          <h3>Диалоги</h3>
          <p>Практика разговорного английского</p>
          <Link to="/english/dialogues" className="block-link">Перейти</Link>
        </div>
        <div className="block">
          <h3>Словарь</h3>
          <p>Расширьте свой словарный запас</p>
          <div className="sub-blocks">
            <Link to="/english/dictionary/basic" className="sub-block">Базовый</Link>
            <Link to="/english/dictionary/idioms" className="sub-block">Идиомы</Link>
            <Link to="/english/dictionary/phrasal-verbs" className="sub-block">Фразовые глаголы</Link>
          </div>
        </div>
        <div className="block">
          <h3>Курсы</h3>
          <p>Структурированное обучение</p>
          <div className="sub-blocks">
            <Link to="/english/courses/beginner" className="sub-block">Начинающий</Link>
            <Link to="/english/courses/intermediate" className="sub-block">Средний</Link>
            <Link to="/english/courses/advanced" className="sub-block">Продвинутый</Link>
          </div>
        </div>
        <div className="block">
          <h3>Материалы</h3>
          <p>Файлы и документы для изучения</p>
          <Link to="/english/materials" className="block-link">Перейти</Link>
        </div>
      </div>
    </main>
  )
}

export default English
