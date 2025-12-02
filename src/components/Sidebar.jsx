import { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ isOpen }) {
  const [openCategories, setOpenCategories] = useState({});
  const [openSubjects, setOpenSubjects] = useState({});
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleCategory = (category, e) => {
    e.stopPropagation();
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleSubject = (subject, e) => {
    e.stopPropagation();
    setOpenSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  const toggleSubmenu = (submenu, e) => {
    e.stopPropagation();
    setOpenSubmenus(prev => ({
      ...prev,
      [submenu]: !prev[submenu]
    }));
  };

  const handleItemHover = (e, isHover) => {
    // Simple hover effect without GSAP
    const target = e.currentTarget;
    if (isHover) {
      target.style.backgroundColor = 'rgba(79, 195, 247, 0.1)';
      target.style.paddingLeft = '15px';
    } else {
      target.style.backgroundColor = 'transparent';
      target.style.paddingLeft = '10px';
    }
  };

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
  ];

  return (
    <div className="sidebar-container">
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <h3>Инструменты для учебы</h3>
          <div className="categories">
            {categories.map(category => (
              <div 
                key={category.name}
                className="category category-item"
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
                onClick={(e) => toggleCategory(category.name, e)}
              >
                <div className="category-header">
                  <h4>{category.name}</h4>
                  <span className="arrow">{openCategories[category.name] ? '▼' : '▶'}</span>
                </div>
                {openCategories[category.name] && (
                  <div className="submenu">
                    {category.subjects.map(subject => (
                      <div 
                        key={subject.name}
                        className="subject"
                        onMouseEnter={(e) => handleItemHover(e, true)}
                        onMouseLeave={(e) => handleItemHover(e, false)}
                        onClick={(e) => toggleSubject(subject.name, e)}
                      >
                        <div className="subject-header">
                          <Link to={subject.path}>{subject.name}</Link>
                          {subject.subitems && (
                            <span className="arrow">
                              {openSubjects[subject.name] ? '▼' : '▶'}
                            </span>
                          )}
                        </div>
                        {subject.subitems && openSubjects[subject.name] && (
                          <div className="subject-submenu">
                            {subject.subitems.map((item, index) => (
                              <div 
                                key={index}
                                className="submenu-item"
                                onMouseEnter={(e) => handleItemHover(e, true)}
                                onMouseLeave={(e) => handleItemHover(e, false)}
                              >
                                {item.path ? (
                                  <Link to={item.path}>{item.name}</Link>
                                ) : (
                                  <div onClick={(e) => toggleSubmenu(item.name, e)}>
                                    {item.name}
                                  </div>
                                )}
                                {item.subitems && (
                                  <div className={`nested-submenu ${openSubmenus[item.name] ? 'open' : ''}`}>
                                    {item.subitems.map((subitem, subIndex) => (
                                      <Link 
                                        key={subIndex} 
                                        to={subitem.path}
                                        className="nested-submenu-item"
                                      >
                                        {subitem.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <hr />
          <h3>Режимы проверки знаний</h3>
          <ul className="knowledge-tests">
            <li>
              <Link
                to="/test-settings"
                className="test-link"
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
              >
                Пройти тест
              </Link>
            </li>
            <li>
              <span
                className="test-link"
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
              >
                Ответить на вопросы
              </span>
            </li>
            <li>
              <span
                className="test-link"
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
              >
                И прочее
              </span>
            </li>
          </ul>

          <hr />
          <h3>Прогресс и достижения</h3>
          <ul className="knowledge-tests">
            <li>
              <Link
                to="/achievements"
                className="test-link"
                onMouseEnter={(e) => handleItemHover(e, true)}
                onMouseLeave={(e) => handleItemHover(e, false)}
              >
                🏆 Мои достижения
              </Link>
            </li>
          </ul>
          
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
