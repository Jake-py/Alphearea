import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api.js'
import '../styles/style.css'
import '../styles/test-taking.css'
import '../styles/smart-editor.css'
import SmartEditor from './SmartEditor'

function TestSettings() {
  const navigate = useNavigate()
  const [testMode, setTestMode] = useState('standard') // 'standard', 'editor', 'ai'
  const [subject, setSubject] = useState('')
  const [numTests, setNumTests] = useState(10)
  const [shuffle, setShuffle] = useState(false)
  const [time, setTime] = useState(30)
  const [testFile, setTestFile] = useState(null)
  const [materialContent, setMaterialContent] = useState('')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSmartEditor, setShowSmartEditor] = useState(false)
  const [parsedQuestions, setParsedQuestions] = useState([])

  const subjects = [
    { value: 'english', label: 'Английский язык' },
    { value: 'korean', label: 'Корейский язык' },
    { value: 'russian', label: 'Русский язык' },
    { value: 'philosophy', label: 'Философия' },
    { value: 'psychology', label: 'Психология' },
    { value: 'mathematics', label: 'Математика' },
    { value: 'programming', label: 'Программирование' },
    { value: 'electronics', label: 'Электроника' }
  ]

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setTestFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMaterialContent(e.target.result)
      }
      reader.readAsText(file)
    }
  }

  const handleParseFile = async () => {
    if (!testFile || !materialContent) return

    if (testMode === 'editor') {
      // Open smart editor for manual selection of correct answers
      setShowSmartEditor(true)
    } else {
      // Standard parsing
      try {
        const response = await fetch(API_ENDPOINTS.testsParse, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: materialContent,
            format: 'standard'
          }),
        })

        const data = await response.json()
        if (response.ok) {
          setParsedQuestions(data.questions || [])
          alert(`Успешно разобрано ${data.questions?.length || 0} вопросов из файла`)
        } else {
          setError(data.error || 'Не удалось разобрать файл')
        }
      } catch (error) {
        setError('Ошибка сети. Попробуйте еще раз.')
      }
    }
  }

  const handleSmartEditorSave = (questions) => {
    setParsedQuestions(questions)
    setShowSmartEditor(false)
    alert(`Тест сохранен! ${questions?.length || 0} вопросов с выбранными правильными ответами.`)
  }

  const handleSmartEditorClose = () => {
    setShowSmartEditor(false)
  }

  const handleGenerateFromMaterials = async () => {
    if (!materialContent || !subject) {
      setError('Пожалуйста, предоставьте материалы и выберите предмет')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(API_ENDPOINTS.testsGenerate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          material: materialContent,
          subject,
          difficulty,
          numQuestions: numTests
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setParsedQuestions(data.questions || [])
        alert(`Успешно сгенерировано ${data.questions?.length || 0} вопросов с помощью ИИ`)
      } else {
        setError(data.error || 'Не удалось сгенерировать тест')
      }
    } catch (error) {
      setError('Ошибка сети. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let testData = null

      if (testMode === 'ai' && materialContent) {
        // Generate test using AI
        const response = await fetch(API_ENDPOINTS.testsGenerate, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            material: materialContent,
            subject,
            difficulty,
            numQuestions: numTests
          }),
        })

        const data = await response.json()
        if (response.ok) {
          testData = {
            title: `Тест, сгенерированный ИИ - ${subject}`,
            subject,
            questions: data.questions || [],
            createdAt: new Date().toISOString()
          }
        } else {
          throw new Error(data.error || 'Не удалось сгенерировать тест')
        }
      } else if ((testMode === 'standard' || testMode === 'editor') && parsedQuestions?.length > 0) {
      // Use parsed questions from smart editor
      testData = {
        title: `Разобранный тест - ${testFile?.name || 'файл'}`,
        subject,
        questions: parsedQuestions,
        createdAt: new Date().toISOString()
      }
    } else if (testMode === 'standard' && testFile) {
      // Parse uploaded file
      const response = await fetch(API_ENDPOINTS.testsParse, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: materialContent,
          format: 'standard'
        }),
      })

      const data = await response.json()
      if (response.ok) {
        testData = {
          title: `Разобранный тест - ${testFile.name}`,
          subject,
          questions: data.questions || [],
          createdAt: new Date().toISOString()
        }
      } else {
        throw new Error(data.error || 'Не удалось разобрать файл')
      }
    } else {
      // Load existing test or create sample test
      testData = {
        title: `Пример теста - ${subject}`,
        subject,
        questions: [
          {
            question: 'Пример вопроса 1?',
            options: ['Вариант A', 'Вариант B', 'Вариант C', 'Вариант D'],
            correctAnswer: 0
          },
          {
            question: 'Пример вопроса 2?',
            options: ['Вариант A', 'Вариант B', 'Вариант C', 'Вариант D'],
            correctAnswer: 1
          }
        ],
        createdAt: new Date().toISOString()
      }
    }

    // Navigate to test taking page with test data
    navigate('/test-taking', {
      state: {
        test: testData,
        settings: { subject, numTests, shuffle, time, testMode }
      }
    })

  } catch (error) {
    setError(error.message || 'Произошла ошибка. Попробуйте еще раз.')
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="test-settings-page">
      <h2>Настройки теста</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="test-mode-selector">
        <h3>Выберите режим загрузки теста:</h3>
        <div className="mode-buttons">
          <button
            type="button"
            className={`mode-button ${testMode === 'standard' ? 'active' : ''}`}
            onClick={() => setTestMode('standard')}
          >
            Стандартный режим
          </button>
          <button
            type="button"
            className={`mode-button ${testMode === 'editor' ? 'active' : ''}`}
            onClick={() => setTestMode('editor')}
          >
            Режим редакции
          </button>
          <button
            type="button"
            className={`mode-button ${testMode === 'ai' ? 'active' : ''}`}
            onClick={() => setTestMode('ai')}
          >
            <span style={{ color: 'gold', fontWeight: 'bold' }}>AI режим</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Выбор предмета:</label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="">Выберите предмет</option>
            {subjects.map(sub => (
              <option key={sub.value} value={sub.value}>{sub.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="numTests">Количество вопросов:</label>
          <input
            type="number"
            id="numTests"
            min="1"
            max="100"
            value={numTests}
            onChange={(e) => setNumTests(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="shuffle"
            checked={shuffle}
            onChange={(e) => setShuffle(e.target.checked)}
          />
          <label htmlFor="shuffle">Перемешать вопросы</label>
        </div>

        <div className="form-group">
          <label htmlFor="time">Время тестирования (минуты):</label>
          <input
            type="number"
            id="time"
            min="1"
            max="300"
            value={time}
            onChange={(e) => setTime(parseInt(e.target.value))}
            required
          />
        </div>

        {testMode === 'ai' && (
          <div className="form-group">
            <label htmlFor="difficulty">Уровень сложности:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="beginner">Начальный</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>
        )}

        {(testMode === 'standard' || testMode === 'editor') && (
          <div className="form-group">
            <label htmlFor="testFile">Загрузить файл теста:</label>
            <input
              type="file"
              id="testFile"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
            />
            {testFile && (
              <button type="button" onClick={handleParseFile} className="parse-button">
                {testMode === 'editor' ? 'Открыть умный редактор' : 'Разобрать файл'}
              </button>
            )}
          </div>
        )}

        {testMode === 'ai' && (
          <div className="form-group">
            <label htmlFor="materialContent">Материалы для генерации теста:</label>
            <textarea
              id="materialContent"
              value={materialContent}
              onChange={(e) => setMaterialContent(e.target.value)}
              placeholder="Вставьте текст материалов или загрузите файл..."
              rows="10"
              required
            />
            <input
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              style={{ marginTop: '10px' }}
            />
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{testMode === 'ai' ? 'Генерируем тест с помощью ИИ...' : 'Обрабатываем файл...'}</p>
          </div>
        ) : (
          <div className="action-buttons">
            <button type="submit" className="start-test-button">
              {testMode === 'ai' ? 'Сгенерировать тест' : 'Начать тест'}
            </button>
            <button type="button" onClick={() => navigate('/test-creator')} className="create-test-button">
              Создать новый тест
            </button>
          </div>
        )}
      </form>

      {showSmartEditor && (
        <SmartEditor
          content={materialContent}
          onSave={handleSmartEditorSave}
          onClose={handleSmartEditorClose}
        />
      )}
    </div>
  )
}

export default TestSettings
