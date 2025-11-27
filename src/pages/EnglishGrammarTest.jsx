import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PointsReward, PointsToast } from '../components/PointsReward'
import usePoints from '../hooks/usePoints'
import '../styles/test-taking.css'
import '../styles/style.css'

function EnglishGrammarTest() {
  const navigate = useNavigate()
  const username = JSON.parse(localStorage.getItem('user') || '{}').username || 'user'
  const { awardPoints } = usePoints(username)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes
  const [isFinished, setIsFinished] = useState(false)
  const [results, setResults] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  const timerRef = useRef(null)

  // Test data for English Grammar
  const testData = {
    title: 'Тест: Грамматика английского языка',
    subject: 'english-grammar',
    description: 'Тест составлен по тем материалам которые есть в том уроке, которые вы прошли',
    questions: [
      {
        question: 'Choose the correct form: "She ___ to work every day."',
        options: ['go', 'goes', 'going', 'gone'],
        correctAnswer: 1,
        explanation: 'With "she" (third person singular), we use "goes"'
      },
      {
        question: 'Which sentence is correct?',
        options: ['I am learning English since 5 years', 'I learn English since 5 years', 'I have been learning English for 5 years', 'I have been learning English since 5 years'],
        correctAnswer: 3,
        explanation: 'We use "for" with time periods and "since" with starting points. "Have been learning" is present perfect continuous.'
      },
      {
        question: 'Fill the blank: "If I ___ rich, I would travel the world."',
        options: ['was', 'were', 'am', 'would be'],
        correctAnswer: 1,
        explanation: 'In conditional sentences, we use "were" with all subjects in second conditional (unreal present)'
      },
      {
        question: 'Choose the correct passive voice: "The cake ___ by Sarah yesterday."',
        options: ['was made', 'is made', 'made', 'has been made'],
        correctAnswer: 0,
        explanation: 'Past simple passive is "was/were + past participle"'
      },
      {
        question: 'What is the correct word order? "Yesterday / I / a / movie / watched"',
        options: ['I watched a movie yesterday', 'I yesterday watched a movie', 'Yesterday I watched a movie', 'Both A and C are correct'],
        correctAnswer: 3,
        explanation: 'Both positions for the time expression are grammatically correct'
      },
      {
        question: 'Which sentence has correct subject-verb agreement?',
        options: ['The team are winning', 'The team is winning', 'A number of students has arrived', 'All of the above'],
        correctAnswer: 3,
        explanation: 'All sentences have correct agreement depending on context and dialect'
      },
      {
        question: 'Choose the correct form: "Neither John nor Mary ___ going to the party."',
        options: ['is', 'are', 'be', 'being'],
        correctAnswer: 0,
        explanation: 'With "neither...nor", the verb agrees with the closest subject (Mary = singular)'
      },
      {
        question: 'What is the correct comparative form of "good"?',
        options: ['gooder', 'better', 'more good', 'goodly'],
        correctAnswer: 1,
        explanation: '"Good" is an irregular adjective. Its comparative is "better"'
      },
      {
        question: 'Fill in the blank: "I wish I ___ English better."',
        options: ['spoke', 'speak', 'have spoken', 'would speak'],
        correctAnswer: 0,
        explanation: 'After "wish", we use past simple to express a present unreal situation'
      },
      {
        question: 'Which sentence has a dangling modifier?',
        options: ['Running quickly, John caught the bus', 'Walking down the street, I saw a beautiful flower', 'Sitting in the cafe, she watched the people', 'Confused about the directions, the map was helpful'],
        correctAnswer: 3,
        explanation: 'The subject "map" is confused, not a person. This is a dangling modifier.'
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

    // Award points if passed
    if (score >= 70) {
      const pointsEarned = Math.round((score / 100) * 50)
      try {
        const result = await awardPoints('test', 'english-grammar-test', 'intermediate')
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

    // Log test result
    try {
      await fetch('http://localhost:3002/api/progress/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          testId: 'english-grammar-test',
          testTitle: 'English Grammar Test',
          subject: 'english',
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
    navigate('/english/grammar')
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

export default EnglishGrammarTest
