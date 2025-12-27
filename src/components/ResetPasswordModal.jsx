import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './ResetPasswordModal.css';

const ResetPasswordModal = ({ isOpen, onClose, token }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.resetPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
      } else {
        setError(data.error || 'Ошибка при сбросе пароля');
      }
    } catch (error) {
      console.error('Ошибка при сбросе пароля:', error);
      setError('Ошибка сети. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="reset-password-modal-overlay">
      <div className="reset-password-modal-container">
        <div className="reset-password-modal">
          <div className="modal-header">
            <h3>Сброс пароля</h3>
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
                <p>Теперь вы можете войти в систему с новым паролем.</p>
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
                  Введите новый пароль для вашей учетной записи.
                </p>

                <div className="password-input-container">
                  <input
                    type="password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      checkPasswordStrength(e.target.value);
                    }}
                    required
                    disabled={isLoading}
                    className="auth-input"
                  />

                  <div className="password-strength-meter">
                    <div className="strength-indicator">
                      <div className={`strength-bar ${passwordStrength.length ? 'active' : ''}`}></div>
                      <div className={`strength-bar ${passwordStrength.uppercase ? 'active' : ''}`}></div>
                      <div className={`strength-bar ${passwordStrength.lowercase ? 'active' : ''}`}></div>
                      <div className={`strength-bar ${passwordStrength.number ? 'active' : ''}`}></div>
                      <div className={`strength-bar ${passwordStrength.special ? 'active' : ''}`}></div>
                    </div>
                    <div className="strength-requirements">
                      <p className={passwordStrength.length ? 'met' : ''}>✓ Минимум 8 символов</p>
                      <p className={passwordStrength.uppercase ? 'met' : ''}>✓ Заглавная буква</p>
                      <p className={passwordStrength.lowercase ? 'met' : ''}>✓ Строчная буква</p>
                      <p className={passwordStrength.number ? 'met' : ''}>✓ Цифра</p>
                      <p className={passwordStrength.special ? 'met' : ''}>✓ Специальный символ</p>
                    </div>
                  </div>
                </div>

                <input
                  type="password"
                  placeholder="Подтвердите новый пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="auth-input"
                />

                {error && <p className="error-message">{error}</p>}

                <button
                  type="submit"
                  className="auth-submit-button"
                  disabled={isLoading || !passwordStrength.length || !passwordStrength.uppercase || !passwordStrength.lowercase || !passwordStrength.number}
                >
                  {isLoading ? 'Сброс...' : 'Сбросить пароль'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;