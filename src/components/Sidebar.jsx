import { useState } from 'react'
import { Link } from 'react-router-dom'

function Sidebar({ isOpen }) {
  const [openCategories, setOpenCategories] = useState({})
  const [openSubjects, setOpenSubjects] = useState({})
  const [openSubmenus, setOpenSubmenus] = useState({})

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

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

  const categories = [
    {
      name: "Иностранные языки",
      icon: "/Alphearea/icon_language.png",
      subjects: [
        {
          name: "Английский язык",
          path: "/english",
          subitems: [
            { name: "Грамматика", path: "/english/grammar" },
            {
              name: "Курсы",
              subitems: [
                { name: "Начальный уровень", path: "/english/courses/beginner" },
                { name: "Средний уровень", path: "/english/courses/intermediate" },
                { name: "Продвинутый уровень", path: "/english/courses/advanced" }
              ]
            },
            {
              name: "Словарь",
              subitems: [
                { name: "Основные слова", path: "/english/dictionary/basic" },
                { name: "Идиомы", path: "/english/dictionary/idioms" },
                { name: "Фразовые глаголы", path: "/english/dictionary/phrasal-verbs" }
              ]
            },
            { name: "Диалоги", path: "/english/dialogues" },
            { name: "Материалы", path: "/english/materials" }
          ]
        },
        {
          name: "Корейский язык",
          path: "/korean",
          subitems: [
            { name: "Грамматика", path: "/korean/grammar" },
            { name: "Курсы", path: "/korean/courses" },
            { name: "Диалоги", path: "/korean/dialogues" }
          ]
        },
        {
          name: "Русский язык",
          path: "/russian",
          subitems: [
            { name: "Грамматика", path: "/russian/grammar" },
            { name: "Курсы", path: "/russian/courses" },
            { name: "Диалоги", path: "/russian/dialogues" }
          ]
        }
      ]
    },
    {
      name: "Математика и вычисления",
      icon: "/Alphearea/icon_math.png",
      subjects: [
        {
          name: "Математика",
          path: "/mathematics",
          subitems: [
            { name: "Основы", path: "/mathematics/basics" },
            { name: "Высшая математика", path: "/mathematics/advanced" },
            { name: "Прикладная", path: "/mathematics/applied" },
            { name: "Задачи", path: "/mathematics/problems" }
          ]
        },
        {
          name: "Программирование",
          path: "/programming",
          subitems: [
            { name: "Основы", path: "/programming/basics" },
            { name: "Веб-разработка", path: "/programming/web" },
            { name: "Языки", path: "/programming/languages" },
            { name: "Базы данных", path: "/programming/databases" },
            { name: "Мобильная разработка", path: "/programming/mobile" },
            { name: "Проекты", path: "/programming/projects" }
          ]
        }
      ]
    },
    {
      name: "Философия и психология",
      icon: "/Alphearea/icon_philosophy.png",
      subjects: [
        {
          name: "Философия",
          path: "/philosophy",
          subitems: [
            { name: "Мудрости", path: "/philosophy/wisdom" },
            { name: "Кратко про книги", path: "/philosophy/books" }
          ]
        },
        {
          name: "Психология",
          path: "/psychology",
          subitems: [
            { name: "Теории", path: "/psychology/theories" },
            { name: "Практики", path: "/psychology/practices" }
          ]
        }
      ]
    },
    {
      name: "Электроника",
      icon: "/Alphearea/icon_electronics.png",
      subjects: [
        {
          name: "Электроника",
          path: "/electronics",
          subitems: [
            { name: "Основы", path: "/electronics/basics" },
            { name: "Компоненты", path: "/electronics/components" },
            { name: "Цифровая", path: "/electronics/digital" },
            { name: "Аналоговая", path: "/electronics/analog" },
            { name: "Схемы", path: "/electronics/circuits" },
            { name: "Микроконтроллеры", path: "/electronics/microcontrollers" }
          ]
        }
      ]
    }
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <h3>Инструменты для учебы</h3>
      <div className="categories">
        {categories.map(cat => (
          <div key={cat.name} className="category">
            <div className="category-header" onClick={() => toggleCategory(cat.name)}>
              <img src={cat.icon} alt={cat.name} className="category-icon" />
              <h4>{cat.name}</h4>
              <span className="arrow">{openCategories[cat.name] ? '▼' : '▶'}</span>
            </div>
            <ul className={`category-subjects ${openCategories[cat.name] ? 'show' : ''}`}>
              {cat.subjects.map(subject => (
                <li key={subject.name} className="subject">
                  <Link to={subject.path} onClick={(e) => e.stopPropagation()}>{subject.name}</Link>
                  {subject.subitems && subject.subitems.length > 0 && (
                    <ul className={`sub-menu ${openSubjects[subject.name] ? 'show' : ''}`}>
                      {subject.subitems.map(subitem => (
                        subitem.subitems ? (
                          <li key={subitem.name} className="has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubmenu(`${subject.name}-${subitem.name}`) }}>
                            {subitem.name}
                            <ul className={`sub-sub-menu ${openSubmenus[`${subject.name}-${subitem.name}`] ? 'show' : ''}`}>
                              {subitem.subitems.map(subSubitem => (
                                <li key={subSubitem.name}>
                                  <Link to={subSubitem.path} onClick={(e) => e.stopPropagation()}>{subSubitem.name}</Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ) : (
                          <li key={subitem.name}>
                            <Link to={subitem.path} onClick={(e) => e.stopPropagation()}>{subitem.name}</Link>
                          </li>
                        )
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

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
