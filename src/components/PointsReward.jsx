import React, { useEffect, useState } from 'react';
import '../styles/pointsReward.css';

/**
 * Компонент анимированной награды за points
 * Показывается когда пользователь завершил активность
 */
export function PointsReward({ 
  isVisible, 
  points = 0, 
  message = 'Отлично!',
  onClose = () => {},
  animationType = 'celebration'
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Автоматически скрываем через 3 секунды
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className={`points-reward-overlay ${isAnimating ? 'show' : 'hide'}`}>
      <div className={`points-reward-modal ${animationType}`}>
        <div className="reward-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${i * 0.1}s`,
              '--duration': `${2 + Math.random() * 1}s`
            }}></div>
          ))}
        </div>

        <div className="reward-content">
          <div className="reward-icon">🎉</div>
          <h2 className="reward-message">{message}</h2>
          <div className="reward-points">
            <span className="points-number">{points}</span>
            <span className="points-label">points</span>
          </div>
          <p className="reward-subtitle">Поздравляем с награждением!</p>
        </div>

        <button className="reward-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Компонент для быстрого уведомления при получении points (toast-style)
 */
export function PointsToast({ message, points, isVisible, type = 'success' }) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div className={`points-toast points-toast-${type} ${show ? 'show' : ''}`}>
      <span className="toast-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✗'}
        {type === 'warning' && '⚠'}
      </span>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
        {points > 0 && <p className="toast-points">+{points} pts</p>}
      </div>
    </div>
  );
}

export default PointsReward;
