# Структура файлов проекта

```
Alphearea/
├── .env.example                     # Пример файла окружения
├── .gitignore                       # Файл для игнорирования Git
├── Отчеты.md                        # Отчеты по проекту
├── apiModule.js                     # Модуль API
├── eslint.config.js                 # Конфигурация ESLint
├── index.html                       # Главная HTML-страница
├── new_start.jpg                    # Изображение
├── package-lock.json                # Зависимости npm
├── package.json                     # Конфигурация npm
├── postcss.config.js                # Конфигурация PostCSS
├── README.md                        # Документация проекта
├── serve.js                         # Серверный скрипт
├── server.js                        # Сервер
├── tailwind.config.js               # Конфигурация Tailwind CSS
├── testApiMocks.js                  # Моки для тестирования API
├── testDocumentation.js             # Документация тестов
├── test_huggingface.js              # Тесты для Hugging Face
├── vite.config.js                   # Конфигурация Vite
├── .github/                         # Конфигурация GitHub
│   └── workflows/
│       └── deploy.yml               # Конфигурация деплоя
├── .vscode/                         # Конфигурация VSCode
├── apiMocks/                        # Моки API
│   ├── apiDataStructure.js          # Структура данных API
│   └── openaiMock.js                # Мок для OpenAI
├── back-end/                        # Бэкенд
│   ├── .env.example                 # Пример файла окружения
│   ├── package-lock.json            # Зависимости npm
│   ├── package.json                 # Конфигурация npm
│   ├── server.js                    # Сервер
│   ├── simpleAuth.js                # Простая аутентификация
│   ├── config/                      # Конфигурация
│   │   └── siteInfo.js              # Информация о сайте
│   └── tests/                       # Тесты
│       └── 1762065482539.json       # Тестовые данные
├── doc/                             # Документация
│   ├── doc-filelist.js              # Список файлов
│   ├── doc-script.js                # Скрипт документации
│   └── doc-style.css                # Стили документации
├── docs/                            # Документация
│   ├── About_web.md                # О веб-проекте
│   ├── COMPLETION_SUMMARY.md        # Итоговый отчет
│   ├── DEPLOYMENT_GUIDE.md          # Руководство по деплою
│   ├── DEPLOYMENT_SUMMARY.md        # Итоги деплоя
│   ├── DEV_GUIDE.md                 # Руководство разработчика
│   ├── FINAL_REPORT.md              # Финальный отчет
│   ├── GITHUB_PAGES_DEPLOYMENT.md   # Деплой на GitHub Pages
│   ├── POINTS_SYSTEM.md             # Система очков
│   ├── SECURITY_FIX.md              # Исправления безопасности
│   ├── SYSTEM_READY.md              # Система готова
│   ├── TEST_INTEGRATION_UPDATE.md   # Обновление интеграции тестов
│   ├── TESTING_AND_DEPLOYMENT.md    # Тестирование и деплой
│   ├── TODO.md                      # Задачи
│   ├── USER_GUIDE.md                # Руководство пользователя
│   ├── dev/                         # Разработка
│   └── testing/                     # Тестирование
├── public/                          # Публичные файлы
│   ├── _headers                     # Заголовки
│   ├── 404.html                     # Страница 404
│   ├── avatar_red.jpg               # Аватар
│   └── red_ice.jpg                  # Изображение
├── src/                             # Исходный код
│   ├── App.jsx                      # Главный компонент
│   ├── main.jsx                     # Точка входа
│   ├── components/                  # Компоненты
│   │   ├── AdvancedGlitchText.jsx   # Текст с эффектом глитча
│   │   ├── AuthButtons.jsx          # Кнопки аутентификации
│   │   ├── AuthManager.jsx          # Менеджер аутентификации
│   │   ├── CanvasGlitchText.jsx     # Текст с эффектом глитча на канвасе
│   │   ├── ChatPanel.jsx            # Панель чата
│   │   ├── Glitch.css               # Стили для глитча
│   │   ├── GlitchText.jsx           # Текст с эффектом глитча
│   │   ├── GraphExamples.jsx        # Примеры графиков
│   │   ├── Header.jsx               # Шапка сайта
│   │   ├── MaterialTreeView.jsx     # Дерево материалов
│   │   ├── NeonTitle.jsx            # Неоновый заголовок
│   │   ├── PointsCounter.jsx        # Счетчик очков
│   │   ├── PointsNotification.jsx   # Уведомление об очках
│   │   ├── PointsReward.jsx         # Награды за очки
│   │   ├── Sidebar.jsx              # Боковая панель
│   │   └── SmartMaterialViewer.jsx  # Умный просмотрщик материалов
│   ├── config/                      # Конфигурация
│   │   ├── api.js                   # Конфигурация API
│   │   └── pointsService.js         # Сервис очков
│   ├── data/                        # Данные
│   │   └── materials/               # Материалы
│   │       ├── materials.json        # JSON с материалами
│   │       ├── english/              # Английский
│   │       │   ├── rules.txt         # Правила
│   │       │   ├── courses/          # Курсы
│   │       │   │   └── beginner/     # Начинающие
│   │       │   │       └── intro.txt # Введение
│   │       │   ├── dialogues/        # Диалоги
│   │       │   │   ├── module4.pdf   # Модуль 4
│   │       │   │   └── travel.txt    # Путешествия
│   │       │   ├── dictionary/       # Словарь
│   │       │   │   └── verbs.txt     # Глаголы
│   │       │   └── grammar/          # Грамматика
│   │       │       ├── asvd.txt       # Грамматика
│   │       │       ├── mlksd.txt      # Грамматика
│   │       │       └── sdca.txt       # Грамматика
│   │       └── korean/               # Корейский
│   │           ├── dialogKorean.txt   # Диалоги
│   │           └── module4.pdf       # Модуль 4
│   ├── hooks/                       # Хуки
│   │   ├── usePoints.js             # Хук для очков
│   │   └── useUser.js               # Хук для пользователя
│   ├── pages/                       # Страницы
│   │   ├── About.jsx                # О проекте
│   │   ├── AccountSettings.jsx      # Настройки аккаунта
│   │   ├── Achievements.jsx         # Достижения
│   │   ├── Electronics.jsx          # Электроника
│   │   ├── ElectronicsMaterials.jsx # Материалы по электронике
│   │   ├── English.jsx              # Английский
│   │   ├── EnglishCoursesAdvanced.jsx # Продвинутые курсы
│   │   ├── EnglishCoursesBeginner.jsx # Курсы для начинающих
│   │   ├── EnglishCoursesIntermediate.jsx # Средние курсы
│   │   ├── EnglishDialogues.jsx     # Диалоги
│   │   ├── EnglishDictionaryBasic.jsx # Базовый словарь
│   │   ├── EnglishDictionaryIdioms.jsx # Идиомы
│   │   ├── EnglishDictionaryPhrasalVerbs.jsx # Фразовые глаголы
│   │   ├── EnglishGrammar.jsx       # Грамматика
│   │   ├── EnglishGrammarTest.jsx   # Тест по грамматике
│   │   ├── EnglishMaterials.jsx     # Материалы
│   │   ├── Korean.jsx               # Корейский
│   │   ├── KoreanCourses.jsx        # Курсы
│   │   ├── KoreanDialogues.jsx      # Диалоги
│   │   ├── KoreanGrammar.jsx        # Грамматика
│   │   ├── KoreanGrammarTest.jsx    # Тест по грамматике
│   │   ├── Main.jsx                 # Главная страница
│   │   ├── Mathematics.jsx          # Математика
│   │   ├── MathematicsBasics.jsx    # Основы математики
│   │   ├── MathematicsMaterials.jsx # Материалы по математике
│   │   ├── Philosophy.jsx           # Философия
│   │   ├── PhilosophyBooks.jsx      # Книги
│   │   ├── PhilosophyWisdom.jsx     # Мудрость
│   │   ├── PhilosophyWisdomTest.jsx # Тест по мудрости
│   │   ├── PrivacySettings.jsx      # Настройки приватности
│   │   ├── Programming.jsx          # Программирование
│   │   ├── ProgrammingMaterials.jsx # Материалы по программированию
│   │   ├── Psychology.jsx           # Психология
│   │   ├── PsychologyPractices.jsx  # Практики
│   │   ├── PsychologyTheories.jsx   # Теории
│   │   ├── PsychologyTheoriesTest.jsx # Тест по теориям
│   │   ├── Russian.jsx              # Русский
│   │   ├── RussianCourses.jsx       # Курсы
│   │   ├── RussianDialogues.jsx     # Диалоги
│   │   ├── RussianGrammar.jsx       # Грамматика
│   │   ├── RussianGrammarTest.jsx   # Тест по грамматике
│   │   ├── Settings.jsx             # Настройки
│   │   ├── SiteSettings.jsx         # Настройки сайта
│   │   ├── SmartEditor.jsx          # Умный редактор
│   │   ├── TDS.jsx                  # TDS
│   │   ├── TestCreator.jsx          # Создание тестов
│   │   ├── TestSettings.jsx         # Настройки тестов
│   │   └── TestTaking.jsx           # Прохождение тестов
│   ├── styles/                      # Стили
│   │   ├── achievements.css         # Стили для достижений
│   │   ├── App.css                  # Стили приложения
│   │   ├── ChatPanel.css           # Стили панели чата
│   │   ├── Electronics.css          # Стили для электроники
│   │   ├── index.css               # Главные стили
│   │   ├── Mathematics.css          # Стили для математики
│   │   ├── points.css              # Стили для очков
│   │   ├── pointsHeader.css        # Стили для заголовка очков
│   │   ├── pointsReward.css        # Стили для наград
│   │   ├── Programming.css         # Стили для программирования
│   │   ├── settings.css            # Стили для настроек
│   │   ├── smart-editor.css        # Стили для редактора
│   │   ├── style.css               # Стили
│   │   ├── test-creator.css        # Стили для создания тестов
│   │   └── test-taking.css         # Стили для прохождения тестов
│   └── utils/                       # Утилиты
│       ├── geminiAI.js             # Утилита для работы с Gemini AI
│       └── scanMaterials.js        # Сканирование материалов
└── templates/                       # Шаблоны
    └── HEAD_TEMPLATE.html          # Шаблон заголовка