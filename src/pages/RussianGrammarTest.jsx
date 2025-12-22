import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PointsReward, PointsToast } from '../components/PointsReward'
import usePoints from '../hooks/usePoints'
import '../styles/test-taking.css'
import '../styles/style.css'

function RussianGrammarTest() {
  const navigate = useNavigate()
  const username = JSON.parse(localStorage.getItem('user') || '{}').username || 'user'
  const { awardPoints } = usePoints(username)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(1200)
  const [isFinished, setIsFinished] = useState(false)
  const [results, setResults] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  const timerRef = useRef(null)

  const testData = {
    title: 'Тест: Грамматика русского языка',
    subject: 'russian-grammar',
    description: 'Тест составлен по тем материалам которые есть в том уроке, которые вы прошли',
    questions: [
      {
        question: 'Выберите правильную форму существительного в родительном падеже:',
        options: ['стол', 'стола', 'столе', 'столом'],
        correctAnswer: 1,
        explanation: 'Родительный падеж единственного числа мужского рода: стол → стола'
      },
      {
        question: 'Какой предлог требует родительный падеж?',
        options: ['в', 'на', 'из', 'по'],
        correctAnswer: 2,
        explanation: 'Предлог "из" всегда требует родительный падеж'
      },
      {
        question: 'Выберите правильный вариант согласования:',
        options: ['красивый дом', 'красивый дома', 'красивой дом', 'красивого дом'],
        correctAnswer: 0,
        explanation: 'Прилагательное "красивый" согласуется с существительным мужского рода в именительном падеже'
      },
      {
        question: 'Выберите правильную форму глагола прошедшего времени:',
        options: ['я пишу', 'я писала', 'я пишет', 'я будет писать'],
        correctAnswer: 1,
        explanation: '"Я писала" - глагол прошедшего времени женского рода'
      },
      {
        question: 'Какое слово в дательном падеже:',
        options: ['собака', 'собаки', 'собаке', 'собакой'],
        correctAnswer: 2,
        explanation: 'Дательный падеж единственного числа: собаке'
      },
      {
        question: 'Выберите правильный вариант с предложным падежом:',
        options: ['в школе', 'в школу', 'из школы', 'к школе'],
        correctAnswer: 0,
        explanation: 'Предложный падеж используется с предлогом "в" для указания места'
      },
      {
        question: 'Какой вид глагола выражает действие, уже закончившееся?',
        options: ['несовершенный вид', 'совершенный вид', 'переходный глагол', 'непереходный глагол'],
        correctAnswer: 1,
        explanation: 'Совершенный вид глагола выражает завершённое действие'
      },
      {
        question: 'Выберите правильное ударение:',
        options: ['кра́сивый', 'краси́вый', 'красиво́й', 'кра́сиво́й'],
        correctAnswer: 0,
        explanation: 'В слове "красивый" ударение падает на первый слог'
      },
      {
        question: 'Выберите правильный вариант с причастием:',
        options: ['дом, построенный', 'дом, строящийся', 'дом, строя', 'дом, постройка'],
        correctAnswer: 0,
        explanation: '"Построенный дом" - причастие прошедшего времени в именительном падеже'
      },
      {
        question: 'Какой вариант правильно спрягает глагол "быть":',
        options: ['я есть', 'я буду', 'я есь', 'я буду быть'],
        correctAnswer: 1,
        explanation: 'Будущее время от "быть": я буду, ты будешь, он будет'
      }
    ]
  }

  useEffect(() => {
    if (!isFinished) {
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
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [isFinished])

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
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleFinishTest = useCallback(async () => {
    if (isFinished) return

    let correct = 0
    const total = testData.questions.length

    testData.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++
      }
    })

    const score = Math.round((correct / total) * 100)
    const timeSpent = 1200 - timeLeft

    const testResults = {
      correct,
      total,
      score,
      answers,
      timeSpent,
      passed: score >= 70
    }

    setResults(testResults)
    setIsFinished(true)
    setShowResults(true)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (score >= 70) {
      const pointsEarned = Math.round((score / 100) * 50)
      try {
        const result = await awardPoints('test', 'russian-grammar-test', 'intermediate')
        if (result.success) {
          setToastMessage(`Тест пройден! Вы получили ${pointsEarned} points`)
          setToastType('success')
          setShowToast(true)
          setShowReward(true)
        }
      } catch (error) {
        console.error('Failed to award points:', error)
      }
    } else {
      setToastMessage(`Вы набрали ${score}%. Нужно минимум 70% для получения points. Попробуйте еще раз!`)
      setToastType('warning')
      setShowToast(true)
    }

    try {
      await fetch('https://alphearea-b.onrender.com/api/progress/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          testId: 'russian-grammar-test',
          testTitle: 'Russian Grammar Test',
          subject: 'russian',
          score,
          correct,
          total,
          timeSpent
        }),
      })
    } catch (error) {
      console.error('Failed to log test result:', error)
    }
  }, [answers, isFinished, awardPoints, timeLeft, username])

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTimeLeft(1200)
    setIsFinished(false)
    setResults(null)
    setShowResults(false)
  }

  const handleGoBack = () => {
    navigate('/russian/grammar')
  }

  const currentQuestion = testData.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / testData.questions.length) * 100

  if (showResults) {
    const { correct, total, score, passed } = results

    return (
      <div className="test-container">
        <div className="test-header">
          <h1>{testData.title}</h1>
        </div>

        <div className="results-container">
          <div className={`results-card ${passed ? 'passed' : 'failed'}`}>
            <div className="results-icon">
              {passed ? '🎉' : '📚'}
            </div>
            <h2>{passed ? 'Тест пройден!' : 'Тест не пройден'}</h2>
            <div className="results-score">
              <div className="score-number">{score}%</div>
              <div className="score-details">
                Правильных ответов: {correct} из {total}
              </div>
            </div>

            {!passed && (
              <div className="results-message">
                <p>Нужно минимум 70% для получения points.</p>
                <p>Попробуйте еще раз!</p>
              </div>
            )}

            {passed && (
              <div className="results-message success">
                <p>✓ Вы получили points за прохождение теста!</p>
                <p>Points добавлены в вашу учетную запись.</p>
              </div>
            )}

            <div className="results-buttons">
              <button className="btn btn-primary" onClick={handleRestart}>
                🔄 Пройти еще раз
              </button>
              <button className="btn btn-secondary" onClick={handleGoBack}>
                ← Вернуться к урокам
              </button>
            </div>
          </div>

          <div className="answers-review">
            <h3>Ваши ответы:</h3>
            <div className="answers-list">
              {testData.questions.map((question, index) => (
                <div key={index} className={`answer-item ${answers[index] === question.correctAnswer ? 'correct' : 'incorrect'}`}>
                  <div className="answer-number">
                    {index + 1}. {answers[index] === question.correctAnswer ? '✓' : '✗'}
                  </div>
                  <div className="answer-content">
                    <p className="question-text">{question.question}</p>
                    <p className="user-answer">Ваш ответ: <strong>{question.options[answers[index]]}</strong></p>
                    {answers[index] !== question.correctAnswer && (
                      <p className="correct-answer">Правильный ответ: <strong>{question.options[question.correctAnswer]}</strong></p>
                    )}
                    <p className="explanation">{question.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PointsReward
          isVisible={showReward}
          points={Math.round((score / 100) * 50)}
          message="Отлично! Тест пройден!"
          onClose={() => setShowReward(false)}
        />

        <PointsToast
          message={toastMessage}
          isVisible={showToast}
          type={toastType}
        />
      </div>
    )
  }

  return (
    <div className="test-container">
      <div className="test-header">
        <h1>{testData.title}</h1>
        <div className="test-info">
          <div className="test-timer">
            ⏱️ {formatTime(timeLeft)}
          </div>
          <div className="test-progress">
            Вопрос {currentQuestionIndex + 1} из {testData.questions.length}
          </div>
        </div>
      </div>

      <div className="test-description">
        <p>📋 {testData.description}</p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="test-content">
        <div className="question-container">
          <div className="question-number">Вопрос {currentQuestionIndex + 1}</div>
          <div className="question-text">
            {currentQuestion.question}
          </div>

          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={index}
                  checked={answers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
                  className="option-input"
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="test-navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Предыдущий
          </button>

          <div className="nav-spacer"></div>

          {currentQuestionIndex === testData.questions.length - 1 ? (
            <button
              className="btn btn-success"
              onClick={handleFinishTest}
            >
              ✓ Завершить тест
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              Следующий →
            </button>
          )}
        </div>
      </div>

      <PointsToast
        message={toastMessage}
        isVisible={showToast}
        type={toastType}
      />
    </div>
  )
}

export default RussianGrammarTest
