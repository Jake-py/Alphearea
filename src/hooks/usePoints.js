import { useState, useEffect, useCallback } from 'react';
import { pointsService } from '../config/pointsService';

/**
 * Hook для управления points в React компонентах
 * Обеспечивает синхронизацию points между компонентами и backend
 */
export function usePoints(userId) {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // Загружает текущий баланс points
  const loadPoints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const totalPoints = await pointsService.getUserPoints(userId);
      setPoints(totalPoints);
      
      const activityHistory = pointsService.getUserActivityHistory(userId);
      setHistory(activityHistory);

      const userAchievements = pointsService.getAchievements(userId);
      setAchievements(userAchievements);
    } catch (err) {
      setError('Ошибка при загрузке points');
      console.error('Error loading points:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Загружает points при монтировании компонента
  useEffect(() => {
    if (userId) {
      loadPoints();
    }
  }, [userId, loadPoints]);

  // Начисляет points за активность
  const awardPoints = useCallback(async (type, contentId, difficulty = 'beginner') => {
    try {
      const result = await pointsService.awardPoints(userId, type, contentId, difficulty);
      
      if (result.success) {
        // Обновляем локальное состояние
        setPoints(prevPoints => prevPoints + result.points);
        
        // Обновляем историю
        const newActivity = {
          completedAt: new Date().toISOString(),
          points: result.points,
          type,
          contentId
        };
        setHistory(prevHistory => [newActivity, ...prevHistory]);

        // Обновляем достижения
        const newAchievements = pointsService.getAchievements(userId);
        setAchievements(newAchievements);
      }
      
      return result;
    } catch (err) {
      setError('Ошибка при начислении points');
      console.error('Error awarding points:', err);
      return {
        success: false,
        points: 0,
        message: 'Ошибка при начислении points'
      };
    }
  }, [userId]);

  // Проверяет, может ли пользователь использовать points
  const canUsePoints = useCallback((requiredPoints) => {
    return pointsService.canUsePoints(userId, requiredPoints);
  }, [userId]);

  // Использует points
  const usePoints = useCallback(async (amount, reason = 'purchase') => {
    try {
      const result = await pointsService.usePoints(userId, amount, reason);
      
      if (result.success) {
        setPoints(prevPoints => prevPoints - amount);
      }
      
      return result;
    } catch (err) {
      setError('Ошибка при использовании points');
      console.error('Error using points:', err);
      return {
        success: false,
        message: 'Ошибка при использовании points'
      };
    }
  }, [userId]);

  // Обновляет данные points
  const refreshPoints = useCallback(() => {
    return loadPoints();
  }, [loadPoints]);

  return {
    points,
    loading,
    error,
    history,
    achievements,
    awardPoints,
    canUsePoints,
    usePoints,
    refreshPoints,
    getPointsConfig: () => pointsService.getPointsConfig()
  };
}

export default usePoints;
