import { useState, useEffect, useCallback } from 'react'
import '../styles/style.css'
import '../styles/test-taking.css'

function SmartEditor({ content, onSave, onClose }) {
  const [parsedQuestions, setParsedQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    parseContent()
  }, [content])

  const parseContent = useCallback(() => {
    setIsLoading(true)
    try {
      const lines = content.split('\n').map(line => line.trim()).filter(line => line)
      const questions = []
      let currentQuestion = null

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Check if this is a question (starts with number followed by ) or .)
        const questionMatch = line.match(/^(\d+)[\)\.\s]+(.+)$/)
        if (questionMatch) {
          // Save previous question if exists
          if (currentQuestion) {
            questions.push(currentQuestion)
          }

          // Start new question
          currentQuestion = {
            id: parseInt(questionMatch[1]),
            question: questionMatch[2],
            options: [],
            correctAnswer: null
          }
        }
        // Check if this is an option (starts with A), B), C), D), etc.)
        else if (currentQuestion && /^[A-Da-d][\)\.\s]+(.+)$/.test(line)) {
          const optionMatch = line.match(/^([A-Da-d])[\)\.\s]+(.+)$/)
          if (optionMatch) {
            const optionLetter = optionMatch[1].toUpperCase()
            const optionText = optionMatch[2]
            const optionIndex = optionLetter.charCodeAt(0) - 65 // A=0, B=1, C=2, D=3

            currentQuestion.options[optionIndex] = optionText
          }
        }
      }

      // Add the last question
      if (currentQuestion) {
        questions.push(currentQuestion)
      }

      setParsedQuestions(questions)
    } catch (error) {
      // Error parsing content handled silently
      setParsedQuestions([])
    } finally {
      setIsLoading(false)
    }
  }, [content])

  useEffect(() => {
    parseContent()
  }, [parseContent])

  const handleCorrectAnswerSelect = (questionId, optionIndex) => {
    setParsedQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, correctAnswer: optionIndex }
          : q
      )
    )
  }

  const handleSave = () => {
    // Convert parsed questions back to test format
    const testQuestions = parsedQuestions.map(q => ({
      question: q.question,
      options: q.options.filter(opt => opt), // Remove empty options
      correctAnswer: q.correctAnswer
    }))

    onSave(testQuestions)
  }

  if (isLoading) {
    return (
      <div className="smart-editor-loading">
        <div className="loading-spinner"></div>
        <p>Анализируем содержание файла...</p>
      </div>
    )
  }

  return (
    <div className="smart-editor-overlay">
      <div className="smart-editor-modal">
        <div className="smart-editor-header">
          <h3>Умный редактор тестов</h3>
          <button onClick={onClose} className="close-editor-button">×</button>
        </div>

        <div className="smart-editor-content">
          <div className="editor-instructions">
            <p><strong>Инструкции:</strong> Выберите правильные ответы, нажав на соответствующие варианты.</p>
            <p>Найдено вопросов: <strong>{parsedQuestions.length}</strong></p>
          </div>

          <div className="parsed-questions">
            {parsedQuestions.map((question, index) => (
              <div key={question.id} className="editor-question">
                <h4>Вопрос {question.id}: {question.question}</h4>

                <div className="editor-options">
                  {question.options.map((option, optionIndex) => (
                    option && (
                      <div
                        key={optionIndex}
                        className={`editor-option ${question.correctAnswer === optionIndex ? 'selected' : ''}`}
                        onClick={() => handleCorrectAnswerSelect(question.id, optionIndex)}
                      >
                        <div className="option-letter">
                          {String.fromCharCode(65 + optionIndex)}
                        </div>
                        <div className="option-text">
                          {option}
                        </div>
                        {question.correctAnswer === optionIndex && (
                          <div className="correct-indicator">✓</div>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="smart-editor-actions">
          <button onClick={handleSave} className="save-test-button">
            Сохранить тест
          </button>
          <button onClick={onClose} className="cancel-button">
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

export default SmartEditor
