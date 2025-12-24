import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api.js'
import '../styles/style.css'
import '../styles/test-taking.css'

function TestCreator() {
  const navigate = useNavigate()
  const [tests, setTests] = useState([])
  const [selectedTest, setSelectedTest] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTest, setNewTest] = useState({
    title: '',
    subject: '',
    questions: []
  })

  useEffect(() => {
    loadTests()
  }, [loadTests])

  const loadTests = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.tests, {
        credentials: 'include',
      })
      const data = await response.json()
      if (response.ok) {
        setTests(data.tests)
      } else {
        setError(data.error || 'Не удалось загрузить тесты')
      }
    } catch (error) {
      setError('Ошибка сети. Попробуйте еще раз.')
    }
  }, [])

  const handleCreateTest = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(API_ENDPOINTS.tests, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTest,
          createdBy: 'admin' // In a real app, get from user context
        }),
        credentials: 'include',
      })

      const data = await response.json()
      if (response.ok) {
        setTests([...tests, data.test])
        setShowCreateForm(false)
        setNewTest({ title: '', subject: '', questions: [] })
      } else {
        setError(data.error || 'Не удалось создать тест')
      }
    } catch (error) {
      setError('Ошибка сети. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTest = async (testId) => {
    if (!confirm('Вы уверены, что хотите удалить этот тест?')) return

    try {
      const response = await fetch(API_ENDPOINTS.test(testId), {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setTests(tests.filter(test => test.id !== testId))
        if (selectedTest && selectedTest.id === testId) {
          setSelectedTest(null)
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Не удалось удалить тест')
      }
    } catch (error) {
      setError('Ошибка сети. Попробуйте еще раз.')
    }
  }

  const handleTakeTest = (test) => {
    navigate('/test-taking', {
      state: {
        test: test,
        settings: {
          subject: test.subject,
          numTests: test.questions?.length || 10,
          shuffle: false,
          time: 30,
          testMode: 'tds'
        }
      }
    })
  }

  const handleCleanupBeta = async () => {
    if (!confirm('Вы уверены, что хотите очистить все бета-записи тестов?')) return

    try {
      const response = await fetch(API_ENDPOINTS.testsCleanup, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()
      if (response.ok) {
        alert(data.message)
        loadTests() // Reload the list
      } else {
        setError(data.error || 'Не удалось очистить бета-записи')
      }
    } catch (error) {
      setError('Ошибка сети. Попробуйте еще раз.')
    }
  }

  const addQuestion = () => {
    setNewTest({
      ...newTest,
      questions: [...newTest.questions, {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }]
    })
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...newTest.questions]
    updatedQuestions[index][field] = value
    setNewTest({ ...newTest, questions: updatedQuestions })
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...newTest.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setNewTest({ ...newTest, questions: updatedQuestions })
  }

  return (
    <div className="tds-admin-panel">
      <h2>Создание и управление тестами</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-actions">
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="create-test-button">
          {showCreateForm ? 'Отмена' : 'Создать новый тест'}
        </button>
        <button onClick={handleCleanupBeta} className="cleanup-button">
          Очистить бета-записи
        </button>
        <button onClick={() => navigate('/test-settings')} className="back-button">
          ← Назад к настройкам
        </button>
      </div>

      {showCreateForm && (
        <div className="create-test-form">
          <h3>Создать новый тест</h3>
          <form onSubmit={handleCreateTest}>
            <div className="form-group">
              <label htmlFor="title">Название теста:</label>
              <input
                type="text"
                id="title"
                value={newTest.title}
                onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Предмет:</label>
              <select
                id="subject"
                value={newTest.subject}
                onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
                required
              >
                <option value="">Выберите предмет</option>
                <option value="english">Английский</option>
                <option value="korean">Корейский</option>
                <option value="russian">Русский</option>
                <option value="philosophy">Философия</option>
                <option value="psychology">Психология</option>
              </select>
            </div>

            <div className="questions-section">
              <h4>Вопросы</h4>
              {newTest.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-item">
                  <div className="form-group">
                    <label>Вопрос {qIndex + 1}:</label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="Введите вопрос"
                      required
                    />
                  </div>

                  <div className="options-group">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="option-item">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Вариант ${String.fromCharCode(65 + oIndex)}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button type="button" onClick={addQuestion} className="add-question-button">
                Добавить вопрос
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isLoading} className="submit-button">
                {isLoading ? 'Создание...' : 'Создать тест'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tests-list">
        <h3>Существующие тесты ({tests.length})</h3>
        {tests.length === 0 ? (
          <p>Тесты не найдены. Создайте свой первый тест выше.</p>
        ) : (
          <div className="tests-grid">
            {tests.map(test => (
              <div key={test.id} className="test-card">
                <h4>{test.title}</h4>
                <p><strong>Предмет:</strong> {test.subject}</p>
                <p><strong>Вопросов:</strong> {test.questions?.length || 0}</p>
                <p><strong>Создан:</strong> {new Date(test.createdAt).toLocaleDateString()}</p>
                <div className="test-actions">
                  <button onClick={() => setSelectedTest(test)} className="view-button">
                    Просмотреть детали
                  </button>
                  <button onClick={() => handleTakeTest(test)} className="take-test-button">
                    Пройти тест
                  </button>
                  <button onClick={() => handleDeleteTest(test.id)} className="delete-button">
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTest && (
        <div className="test-details-modal">
          <div className="modal-content">
            <h3>{selectedTest.title}</h3>
            <p><strong>Предмет:</strong> {selectedTest.subject}</p>
            <p><strong>Вопросов:</strong> {selectedTest.questions?.length || 0}</p>

            <div className="questions-preview">
              <h4>Предварительный просмотр вопросов:</h4>
              {selectedTest.questions?.map((question, index) => (
                <div key={index} className="question-preview">
                  <p><strong>В{index + 1}:</strong> {question.question}</p>
                  <ul>
                    {question.options?.map((option, oIndex) => (
                      <li key={oIndex} className={question.correctAnswer === oIndex ? 'correct' : ''}>
                        {String.fromCharCode(65 + oIndex)}. {option}
                        {question.correctAnswer === oIndex && ' ✓'}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button onClick={() => handleTakeTest(selectedTest)} className="take-test-button">
                Пройти этот тест
              </button>
              <button onClick={() => setSelectedTest(null)} className="close-modal-button">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestCreator
