import React from 'react';
import '../styles/points.css';

/**
 * Компонент для отображения уведомления о точках
 * Показывает, сколько points пользователь получит за завершение активности
 */
export function PointsNotification({ pointsValue, description = 'За прохождение этого материала вы получите', type = 'info' }) {
  return (
    <div className={`points-notification points-notification-${type}`}>
      <div className="points-notification-content">
        <span className="points-icon">⭐</span>
        <div className="points-text">
          <p className="points-description">{description}</p>
          <p className="points-value">{pointsValue} points</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Компонент для отображения полной информации о points на странице
 */
export function PointsInfo({ 
  currentPoints, 
  pointsForCompletion, 
  totalPointsEarned = 0,
  description = 'Заработайте points, пройдя этот курс'
}) {
  return (
    <div className="points-info-card">
      <div className="points-info-header">
        <h3>💰 Система Points</h3>
      </div>
      
      <div className="points-info-body">
        <div className="points-info-row">
          <span className="label">Текущий баланс:</span>
          <span className="value">{currentPoints} pts</span>
        </div>
        
        <div className="points-info-row highlight">
          <span className="label">За прохождение:</span>
          <span className="value">{pointsForCompletion} pts</span>
        </div>
        
        {totalPointsEarned > 0 && (
          <div className="points-info-row">
            <span className="label">Всего заработано:</span>
            <span className="value">{totalPointsEarned} pts</span>
          </div>
        )}
        
        <p className="points-info-description">{description}</p>
      </div>
    </div>
  );
}

export default PointsNotification;
