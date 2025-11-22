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
  const [generationMethod, setGenerationMethod] = useState('materials') // 'materials', 'parameters'
  const [parameters, setParameters] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
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
    // Validate the corrected questions
    const validation = validateTestFormat(questions)
    if (validation.valid) {
      setParsedQuestions(questions)
      setShowSmartEditor(false)
      setError('')
      alert(`Тест исправлен и сохранен! ${questions?.length || 0} вопросов с выбранными правильными ответами.`)
    } else {
      setError(`Ошибка в формате теста: ${validation.error}. Пожалуйста, исправьте ошибки.`)
    }
  }

  const handleSmartEditorClose = () => {
    setShowSmartEditor(false)
    setParsedQuestions([])
    setError('')
  }

  const validateTestFormat = (questions) => {
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return { valid: false, error: 'Тест не содержит вопросов' }
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]

      if (!q.question || typeof q.question !== 'string' || q.question.trim().length === 0) {
        return { valid: false, error: `Вопрос ${i + 1}: отсутствует текст вопроса` }
      }

      if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        return { valid: false, error: `Вопрос ${i + 1}: должно быть ровно 4 варианта ответа` }
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j] || typeof q.options[j] !== 'string' || q.options[j].trim().length === 0) {
          return { valid: false, error: `Вопрос ${i + 1}, вариант ${j + 1}: пустой вариант ответа` }
        }
      }

      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        return { valid: false, error: `Вопрос ${i + 1}: правильный ответ должен быть числом от 0 до 3` }
      }
    }

    return { valid: true }
  }

  const handleGenerateFromMaterials = async () => {
    if ((generationMethod === 'materials' && (!materialContent || !subject)) ||
        (generationMethod === 'parameters' && (!parameters || !subject))) {
      setError('Пожалуйста, предоставьте необходимые данные и выберите предмет')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const requestBody = {
        subject,
        difficulty,
        numQuestions: numTests,
        generationMethod
      };

      if (generationMethod === 'materials') {
        requestBody.material = materialContent;
      } else if (generationMethod === 'parameters') {
        requestBody.parameters = parameters;
      } else if (generationMethod === 'combo') {
        requestBody.material = materialContent;
        requestBody.parameters = parameters;
      }

      const response = await fetch(API_ENDPOINTS.testsGenerate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      if (response.ok) {
        // Validate the generated test format
        const questions = data.questions || []
        const validation = validateTestFormat(questions)

        if (validation.valid) {
          setParsedQuestions(questions)
          setIsValidating(false)
          alert(`Успешно сгенерировано ${questions.length} вопросов с помощью ИИ`)
        } else {
          // Open smart editor for manual correction
          setIsValidating(false)
          setShowSmartEditor(true)
          setParsedQuestions(questions) // Pass the invalid questions to editor
          setError(`Тест сгенерирован, но содержит ошибки формата: ${validation.error}. Открываем редактор для исправления.`)
        }
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

      if (testMode === 'ai') {
        // Use already generated and validated questions
        if (!parsedQuestions || parsedQuestions.length === 0) {
          throw new Error('Сначала сгенерируйте тест с помощью ИИ')
        }

        testData = {
          title: `Тест, сгенерированный ИИ - ${subject}`,
          subject,
          questions: parsedQuestions,
          createdAt: new Date().toISOString()
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

      // Validate test data before navigation
      if (!testData || !testData.questions || testData.questions.length === 0) {
        throw new Error('Тест не содержит вопросов. Пожалуйста, проверьте настройки.')
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
            onChange={(e) => setNumTests(parseInt(e.target.value) || 10)}
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
            onChange={(e) => setTime(parseInt(e.target.value) || 30)}
            required
          />
        </div>

        {testMode === 'ai' && (
          <>
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

            <div className="form-group">
              <label>Выберите способ генерации:</label>
              <div className="generation-methods">
                <div className="method-option">
                  <input
                    type="radio"
                    id="materials"
                    name="generationMethod"
                    value="materials"
                    checked={generationMethod === 'materials'}
                    onChange={(e) => setGenerationMethod(e.target.value)}
                  />
                  <label htmlFor="materials">1) Генерация с помощью заданных материалов</label>
                </div>
                <div className="method-option">
                  <input
                    type="radio"
                    id="parameters"
                    name="generationMethod"
                    value="parameters"
                    checked={generationMethod === 'parameters'}
                    onChange={(e) => setGenerationMethod(e.target.value)}
                  />
                  <label htmlFor="parameters">2) Генерация с помощью строго заданных параметров</label>
                </div>

              </div>
            </div>

            {generationMethod === 'materials' && (
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
                <div className="info-section">
                  <button className="info-button" title="Условия для отправки материала">?</button>
                  <p className="info-text">
                    Материалы должны быть объемнее, чтобы тесты не получились мало. Также знайте что картинки и видео AI режим не принимает и пропустит, он увидит лишь тексты и составит из них, и также, чем объемнее материал, тем дольше продлиться генерация
                  </p>
                </div>
              </div>
            )}

            {generationMethod === 'parameters' && (
              <div className="form-group">
                <label htmlFor="parameters">Параметры для генерации:</label>
                <textarea
                  id="parameters"
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                  placeholder="Напишите четко параметры для генерации..."
                  rows="5"
                  required
                />
                <div className="info-section">
                  <button className="info-button" title="Условия для параметров">?</button>
                  <p className="info-text">
                    Напишите все четко, без лишних слов и вводных. Также параметра напишите полностью, для точной генерации
                  </p>
                </div>
              </div>
            )}
          </>
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
      

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Генерируем тест с помощью ИИ...</p>
          </div>
        ) : isValidating ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Тест проверяется на наличие ошибок в формате...</p>
          </div>
        ) : (
        <div className="action-buttons">
            {testMode === 'ai' && parsedQuestions.length > 0 ? (
              <button type="submit" className="start-test-button">
                Пройти тест
              </button>
            ) : testMode === 'ai' ? (
              <button type="button" onClick={handleGenerateFromMaterials} className="start-test-button">
                Сгенерировать тест
              </button>
            ) : (
              <button type="submit" className="start-test-button">
                Начать тест
              </button>
            )}
            
          <button
            type="button"
            onClick={() => navigate('/test-creator')}
            className="create-test-button"
            style={{ marginTop: '20px', marginLeft: '0px' }}
          >
            Создать новый тест
          </button>

            <button type="button"
            onClick={() => navigate('/')}
            className="home-button"
            style={{ marginTop: '20px', marginLeft: '20px' }}>
              На главную
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
