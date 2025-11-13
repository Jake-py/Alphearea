import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/style.css'
import '../styles/test-taking.css'

function TestTaking() {
  const location = useLocation()
  const navigate = useNavigate()
  const { test: originalTest, settings } = location.state || {}

  const [test, setTest] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(settings?.time * 60 || 1800) // default 30 minutes
  const [isFinished, setIsFinished] = useState(false)
  const [results, setResults] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const timerRef = useRef(null)

  const processTest = useCallback((testData, shuffleEnabled) => {
    if (!testData || !testData.questions || testData.questions.length === 0) {
      // If no questions, create a default test
      return {
        title: 'Тест недоступен',
        subject: 'general',
        questions: [
          {
            question: 'Тест не может быть загружен. Пожалуйста, вернитесь к настройкам.',
            options: ['OK'],
            correctAnswer: 0
          }
        ],
        createdAt: new Date().toISOString()
      }
    }

    let processedTest = { ...testData }

    if (shuffleEnabled) {
      // Shuffle questions
      const shuffledQuestions = [...testData.questions]
      for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
      }

      // Shuffle options within each question
      shuffledQuestions.forEach(question => {
        if (!question.options || question.options.length < 2) return

        const originalCorrectAnswer = question.correctAnswer
        const shuffledOptions = [...question.options]
        const indices = shuffledOptions.map((_, index) => index)

        // Shuffle indices
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Reorder options and update correct answer index
        question.options = indices.map(index => shuffledOptions[index])
        question.correctAnswer = indices.indexOf(originalCorrectAnswer)
      })

      processedTest.questions = shuffledQuestions
    }

    return processedTest
  }, [])

  // Process test when component mounts or state changes
  useEffect(() => {
    if (!originalTest || !settings) {
      navigate('/test-settings')
      return
    }

    const processedTest = processTest(originalTest, settings.shuffle)
    setTest(processedTest)
    setTimeLeft(settings.time * 60 || 1800)
  }, [originalTest, settings, navigate, processTest])

  // Start timer when test is ready
  useEffect(() => {
    if (!test || isFinished) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinishTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [test, isFinished])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleFinishTest = useCallback(async () => {
    if (!test || !settings) return

    // Calculate results
    let correct = 0
    let total = test.questions.length

    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++
      }
    })

    const score = Math.round((correct / total) * 100)
    const timeSpent = settings.time ? (settings.time * 60) - timeLeft : 0
    const results = {
      correct,
      total,
      score,
      answers,
      timeSpent
    }

    setResults(results)
    setIsFinished(true)
    setShowResults(true)

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Log test result to profile
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user && user.username) {
        await fetch('http://localhost:3002/api/progress/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            testId: test.id || 'unknown',
            testTitle: test.title,
            subject: test.subject || 'general',
            score,
            correct,
            total,
            timeSpent
          }),
        })
      }
    } catch (error) {
      console.error('Failed to log test result:', error)
    }
  }, [test, answers, settings, timeLeft])

  const handleRestart = () => {
    navigate('/test-settings')
  }

  if (!test) {
    return <div className="loading">Загрузка теста...</div>
  }

  if (showResults) {
    return (
      <div className="test-results">
        <h2>Результаты теста</h2>
        <div className="results-summary">
          <div className="score-circle">
            <div className="score-number">{results.score}%</div>
            <div className="score-label">Правильных ответов</div>
          </div>
          <div className="results-details">
            <p><strong>Правильных ответов:</strong> {results.correct} из {results.total}</p>
            <p><strong>Время:</strong> {formatTime(results.timeSpent)}</p>
            <p><strong>Оценка:</strong> {
              results.score >= 90 ? 'Отлично' :
              results.score >= 75 ? 'Хорошо' :
              results.score >= 60 ? 'Удовлетворительно' : 'Неудовлетворительно'
            }</p>
          </div>
        </div>

        <div className="question-review">
          <h3>Проверка ответов</h3>
          {test.questions.map((question, index) => (
            <div key={index} className={`question-result ${answers[index] === question.correctAnswer ? 'correct' : 'incorrect'}`}>
              <h4>Вопрос {index + 1}: {question.question}</h4>
              <ul>
                {question.options.map((option, oIndex) => (
                  <li key={oIndex} className={
                    oIndex === question.correctAnswer ? 'correct-answer' :
                    answers[index] === oIndex ? 'wrong-answer' : ''
                  }>
                    {String.fromCharCode(65 + oIndex)}. {option}
                    {oIndex === question.correctAnswer && ' ✓'}
                    {answers[index] === oIndex && oIndex !== question.correctAnswer && ' ✗'}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="results-actions">
          <button onClick={handleRestart} className="restart-button">
            Пройти другой тест
          </button>
          <button onClick={() => navigate('/')} className="home-button">
            На главную
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = test.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100

  return (
    <div className="test-taking">
      <div className="test-header">
        <div className="test-info">
          <h2>{test.title}</h2>
          <p>Вопрос {currentQuestionIndex + 1} из {test.questions.length}</p>
        </div>
        <div className="test-timer">
          <div className={`timer ${timeLeft < 300 ? 'warning' : ''}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question-container">
        <div className="question">
          <h3>{currentQuestion.question}</h3>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="option">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={index}
                  checked={answers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
                />
                <span className="option-text">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="test-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="nav-button previous"
        >
          Предыдущий
        </button>

        <div className="question-indicators">
          {test.questions.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentQuestionIndex ? 'active' : ''} ${answers[index] !== undefined ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {currentQuestionIndex === test.questions.length - 1 ? (
          <button
            onClick={handleFinishTest}
            className="nav-button finish"
            disabled={Object.keys(answers).length !== test.questions.length}
          >
            Завершить тест
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="nav-button next"
          >
            Следующий
          </button>
        )}
      </div>
    </div>
  )
}

export default TestTaking
