import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Пожалуйста, введите корректный email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.forgotPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        // В реальном приложении здесь можно автоматически закрыть модальное окно
        // и показать уведомление об успешной отправке
      } else {
        setError(data.error || 'Ошибка при отправке запроса на восстановление пароля');
      }
    } catch (error) {
      console.error('Ошибка при восстановлении пароля:', error);
      setError('Ошибка сети. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="forgot-password-modal-overlay">
      <div className="forgot-password-modal-container">
        <div className="forgot-password-modal">
          <div className="modal-header">
            <h3>Восстановление пароля</h3>
            <button
              className="close-button"
              onClick={onClose}
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          <div className="modal-content">
            {success ? (
              <div className="success-message">
                <p>{success}</p>
                <p>Проверьте вашу электронную почту для дальнейших инструкций.</p>
                <button
                  className="auth-submit-button"
                  onClick={onClose}
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="instruction-text">
                  Введите ваш email, и мы отправим вам ссылку для восстановления пароля.
                </p>

                <input
                  type="email"
                  placeholder="Ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="auth-input"
                />

                {error && <p className="error-message">{error}</p>}

                <button
                  type="submit"
                  className="auth-submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Отправка...' : 'Отправить ссылку для восстановления'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;