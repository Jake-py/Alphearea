import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PointsReward, PointsToast } from '../components/PointsReward'
import usePoints from '../hooks/usePoints'
import '../styles/test-taking.css'
import '../styles/style.css'

function KoreanGrammarTest() {
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
    title: 'Тест: Грамматика корейского языка',
    subject: 'korean-grammar',
    description: 'Тест составлен по тем материалам которые есть в том уроке, которые вы прошли',
    questions: [
      {
        question: '이것은 무엇입니까? (What is this?) - Выберите правильную форму вежливого вопроса:',
        options: ['이것이 무엇이에요?', '이것은 무엇이에요?', '이것이 뭐예요?', 'Все варианты верны'],
        correctAnswer: 1,
        explanation: 'В вежливой речи используется "이것은 무엇이에요?" (это что есть?)'
      },
      {
        question: 'Выберите правильную форму причастия прошедшего времени:',
        options: ['가는 책', '가온 책', '간 책', '갈 책'],
        correctAnswer: 2,
        explanation: '"간 책" - прошедшее причастие от глагола "가다" (идти)'
      },
      {
        question: 'Какая форма используется для выражения желания?',
        options: ['먹고 싶어요', '먹겠어요', '먹었어요', '먹어요'],
        correctAnswer: 0,
        explanation: '"먹고 싶어요" - хочу есть. -(고) 싶다 выражает желание'
      },
      {
        question: 'Выберите правильную форму пассивного залога:',
        options: ['책을 읽어요', '책이 읽혀요', '책을 읽히고', '책에 읽어요'],
        correctAnswer: 1,
        explanation: '"책이 읽혀요" - книга читается (пассивный залог)'
      },
      {
        question: 'Какая служебная частица показывает направление действия?',
        options: ['이/가', '을/를', '으로/로', '에게'],
        correctAnswer: 2,
        explanation: '으로/로 указывает на направление или место действия'
      },
      {
        question: 'Выберите правильный вариант с окончанием -세요:',
        options: ['먹세요', '드세요', '가세요', 'Все верны'],
        correctAnswer: 3,
        explanation: '-세요 - вежливое повелительное окончание, добавляется ко всем глаголам'
      },
      {
        question: 'Какое предложение грамматически верно?',
        options: ['나는 학교에 간다', '나가 학교을 간다', '나를 학교에 간다', '나는 학교로 간다'],
        correctAnswer: 0,
        explanation: 'Подлежащее "나" берет частицу 는, место - частицу 에'
      },
      {
        question: 'Выберите правильную форму -ㄹ/을 것 같다:',
        options: ['비가 올 것 같다', '비가 올 같다', '비를 올 것 같다', '비는 온 것 같다'],
        correctAnswer: 0,
        explanation: '비가 올 것 같다 - кажется, что пойдет дождь'
      },
      {
        question: 'Какая конструкция выражает причину?',
        options: ['-은/는데', '-기 때문에', '-어서/아서', '-으니까'],
        correctAnswer: 1,
        explanation: '-기 때문에 - основной способ выражения причины, "из-за того, что"'
      },
      {
        question: 'Выберите правильный вариант с косвенной речью:',
        options: ['그가 "학교에 간다"고 말했어요', '그가 학교에 간다고 말했어요', '그가 학교에 간다 말했어요', '그는 학교에 갔다고 말했어요'],
        correctAnswer: 0,
        explanation: 'В косвенной речи используется -고 после глагола, затем 말하다'
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
        const result = await awardPoints('test', 'korean-grammar-test', 'intermediate')
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
          testId: 'korean-grammar-test',
          testTitle: 'Korean Grammar Test',
          subject: 'korean',
          score,
          correct,
          total,
          timeSpent
        }),
        credentials: 'include',
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
    navigate('/korean/grammar')
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

export default KoreanGrammarTest
