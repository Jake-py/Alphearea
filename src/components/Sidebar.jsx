import { useState } from 'react'
import { Link } from 'react-router-dom'

function Sidebar({ isOpen }) {
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
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <h3>Инструменты для учебы</h3>
      <ul>
        <li className="subject" data-subject="english" onClick={() => toggleSubject('english')}>
          <Link to="/english">Английский язык</Link>
          <ul className={`sub-menu ${openSubjects.english ? 'show' : ''}`}>
            <li><Link to="/english/grammar" onClick={(e) => e.stopPropagation()}>Грамматика</Link></li>
            <li className="has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubmenu('english-courses') }}>
              Курсы
              <ul className={`sub-sub-menu ${openSubmenus['english-courses'] ? 'show' : ''}`}>
                <li><Link to="/english/courses/beginner" onClick={(e) => e.stopPropagation()}>Начальный уровень</Link></li>
                <li><Link to="/english/courses/intermediate" onClick={(e) => e.stopPropagation()}>Средний уровень</Link></li>
                <li><Link to="/english/courses/advanced" onClick={(e) => e.stopPropagation()}>Продвинутый уровень</Link></li>
              </ul>
            </li>
            <li className="has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubmenu('english-dictionary') }}>
              Словарь
              <ul className={`sub-sub-menu ${openSubmenus['english-dictionary'] ? 'show' : ''}`}>
                <li><Link to="/english/dictionary/basic" onClick={(e) => e.stopPropagation()}>Основные слова</Link></li>
                <li><Link to="/english/dictionary/idioms" onClick={(e) => e.stopPropagation()}>Идиомы</Link></li>
                <li><Link to="/english/dictionary/phrasal-verbs" onClick={(e) => e.stopPropagation()}>Фразовые глаголы</Link></li>
              </ul>
            </li>
            <li><Link to="/english/dialogues" onClick={(e) => e.stopPropagation()}>Диалоги</Link></li>
            <li><Link to="/english/materials" onClick={(e) => e.stopPropagation()}>Материалы <span className="arrow">▶</span></Link></li>
          </ul>
        </li>

        <li className="subject" data-subject="korean" onClick={() => toggleSubject('korean')}>
          <Link to="/korean">Корейский язык</Link>
          <ul className={`sub-menu ${openSubjects.korean ? 'show' : ''}`}>
            <li><Link to="/korean/grammar" onClick={(e) => e.stopPropagation()}>Грамматика</Link></li>
            <li><Link to="/korean/courses" onClick={(e) => e.stopPropagation()}>Курсы</Link></li>
            <li><Link to="/korean/dialogues" onClick={(e) => e.stopPropagation()}>Диалоги</Link></li>
          </ul>
        </li>

        <li className="subject" data-subject="russian" onClick={() => toggleSubject('russian')}>
          <Link to="/russian">Русский язык</Link>
          <ul className={`sub-menu ${openSubjects.russian ? 'show' : ''}`}>
            <li><Link to="/russian/grammar" onClick={(e) => e.stopPropagation()}>Грамматика</Link></li>
            <li><Link to="/russian/courses" onClick={(e) => e.stopPropagation()}>Курсы</Link></li>
            <li><Link to="/russian/dialogues" onClick={(e) => e.stopPropagation()}>Диалоги</Link></li>
          </ul>
        </li>

        <li className="subject" data-subject="philosophy" onClick={() => toggleSubject('philosophy')}>
          <Link to="/philosophy">Философия</Link>
          <ul className={`sub-menu ${openSubjects.philosophy ? 'show' : ''}`}>
            <li><Link to="/philosophy/wisdom" onClick={(e) => e.stopPropagation()}>Мудрости</Link></li>
            <li><Link to="/philosophy/books" onClick={(e) => e.stopPropagation()}>Кратко про книги</Link></li>
          </ul>
        </li>

        <li className="subject" data-subject="psychology" onClick={() => toggleSubject('psychology')}>
          <Link to="/psychology">Психология</Link>
          <ul className={`sub-menu ${openSubjects.psychology ? 'show' : ''}`}>
            <li><Link to="/psychology/theories" onClick={(e) => e.stopPropagation()}>Теории</Link></li>
            <li><Link to="/psychology/practices" onClick={(e) => e.stopPropagation()}>Практики</Link></li>
          </ul>
        </li>

        <li className="subject" data-subject="mathematics" onClick={() => toggleSubject('mathematics')}>
          <Link to="/mathematics">Математика</Link>
          <ul className={`sub-menu ${openSubjects.mathematics ? 'show' : ''}`}>
            <li><Link to="/mathematics/basics" onClick={(e) => e.stopPropagation()}>Основы</Link></li>
            <li><Link to="/mathematics/advanced" onClick={(e) => e.stopPropagation()}>Высшая математика</Link></li>
            <li><Link to="/mathematics/applied" onClick={(e) => e.stopPropagation()}>Прикладная</Link></li>
            <li><Link to="/mathematics/problems" onClick={(e) => e.stopPropagation()}>Задачи</Link></li>
          </ul>
        </li>

        <li className="subject" data-subject="programming" onClick={() => toggleSubject('programming')}>
          <Link to="/programming">Программирование</Link>
          <ul className={`sub-menu ${openSubjects.programming ? 'show' : ''}`}>
            <li><Link to="/programming/basics" onClick={(e) => e.stopPropagation()}>Основы</Link></li>
            <li><Link to="/programming/web" onClick={(e) => e.stopPropagation()}>Веб-разработка</Link></li>
            <li><Link to="/programming/languages" onClick={(e) => e.stopPropagation()}>Языки</Link></li>
            <li><Link to="/programming/databases" onClick={(e) => e.stopPropagation()}>Базы данных</Link></li>
            <li><Link to="/programming/mobile" onClick={(e) => e.stopPropagation()}>Мобильная разработка</Link></li>
            <li><Link to="/programming/projects" onClick={(e) => e.stopPropagation()}>Проекты</Link></li>
          </ul>
        </li>

        <li className="subject" data-subject="electronics" onClick={() => toggleSubject('electronics')}>
          <Link to="/electronics">Электроника</Link>
          <ul className={`sub-menu ${openSubjects.electronics ? 'show' : ''}`}>
            <li><Link to="/electronics/basics" onClick={(e) => e.stopPropagation()}>Основы</Link></li>
            <li><Link to="/electronics/components" onClick={(e) => e.stopPropagation()}>Компоненты</Link></li>
            <li><Link to="/electronics/digital" onClick={(e) => e.stopPropagation()}>Цифровая</Link></li>
            <li><Link to="/electronics/analog" onClick={(e) => e.stopPropagation()}>Аналоговая</Link></li>
            <li><Link to="/electronics/circuits" onClick={(e) => e.stopPropagation()}>Схемы</Link></li>
            <li><Link to="/electronics/microcontrollers" onClick={(e) => e.stopPropagation()}>Микроконтроллеры</Link></li>
          </ul>
        </li>
      </ul>

      <hr />
      <h3>Режимы проверки знаний</h3>
      <ul>
        <li><Link to="/test-settings">Пройти тест</Link></li>
        <li>Ответить на вопросы</li>
        <li>И прочее</li>
      </ul>
    </aside>
  )
}

export default Sidebar
