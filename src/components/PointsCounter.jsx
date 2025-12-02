import React, { useState, useEffect } from 'react';
import { usePoints } from '../hooks/usePoints';

/**
 * Компонент для отображения текущего баланса points в header
 */
function PointsCounter({ userId }) {
  const { points, loading, error } = usePoints(userId);

  if (loading) {
    return (
      <div className="points-counter">
        <span className="points-icon">⏳</span>
        <span className="points-value">...</span>
        <span className="points-label">PTS</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="points-counter" title={error}>
        <span className="points-icon">⚠️</span>
        <span className="points-value">0</span>
        <span className="points-label">PTS</span>
      </div>
    );
  }

  return (
    <div className="points-counter" title={`Текущий баланс: ${points} points`}>
      <span className="points-icon">💰</span>
      <span className="points-value">{points}</span>
      <span className="points-label">PTS</span>
    </div>
  );
}

export default PointsCounter;