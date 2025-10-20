import { useState } from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  const [openSubjects, setOpenSubjects] = useState({})
  const [openSubmenus, setOpenSubmenus] = useState({})

  const toggleSubject = (subject) => {
    setOpenSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }))
  }

  const toggleSubmenu = (submenu) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [submenu]: !prev[submenu]
    }))
  }

  return (
    <aside className="sidebar">
      <h3>Инструменты для учебы</h3>
      <ul>
        <li className="subject" data-subject="english" onClick={() => toggleSubject('english')}>
          <Link to="/english">Английский язык</Link>
          <ul className={`sub-menu ${openSubjects.english ? 'show' : ''}`}>
            <li>Грамматика</li>
            <li className="has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubmenu('english-courses') }}>
              Курсы
              <ul className={`sub-sub-menu ${openSubmenus['english-courses'] ? 'show' : ''}`}>
                <li>Начальный уровень</li>
                <li>Средний уровень</li>
                <li>Продвинутый уровень</li>
              </ul>
            </li>
            <li className="has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubmenu('english-dictionary') }}>
              Словарь
              <ul className={`sub-sub-menu ${openSubmenus['english-dictionary'] ? 'show' : ''}`}>
                <li>Основные слова</li>
                <li>Идиомы</li>
                <li>Фразовые глаголы</li>
              </ul>
            </li>
            <li>Диалоги</li>
          </ul>
        </li>

        <li className="subject" data-subject="korean" onClick={() => toggleSubject('korean')}>
          Корейский язык
          <ul className={`sub-menu ${openSubjects.korean ? 'show' : ''}`}>
            <li>Грамматика</li>
            <li>Курсы</li>
            <li>Диалоги</li>
          </ul>
        </li>

        <li className="subject" data-subject="russian" onClick={() => toggleSubject('russian')}>
          Русский язык
          <ul className={`sub-menu ${openSubjects.russian ? 'show' : ''}`}>
            <li>Грамматика</li>
            <li>Курсы</li>
            <li>Диалоги</li>
          </ul>
        </li>

        <li className="subject" data-subject="philosophy" onClick={() => toggleSubject('philosophy')}>
          <Link to="/philosophy">Философия</Link>
          <ul className={`sub-menu ${openSubjects.philosophy ? 'show' : ''}`}>
            <li>Мудрости</li>
            <li>Кратко про книги</li>
          </ul>
        </li>

        <li className="subject" data-subject="psychology" onClick={() => toggleSubject('psychology')}>
          <Link to="/psychology">Психология</Link>
          <ul className={`sub-menu ${openSubjects.psychology ? 'show' : ''}`}>
            <li>Теории</li>
            <li>Практики</li>
          </ul>
        </li>
      </ul>

      <hr />
      <h3>Режимы проверки знаний</h3>
      <ul>
        <li>Пройти тест</li>
        <li>Ответить на вопросы</li>
        <li>И прочее</li>
      </ul>
    </aside>
  )
}

export default Sidebar
