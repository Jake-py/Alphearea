// Points система - определение правил и функций
// Это определяет quanto очков дается за каждый тип активности

const POINTS_CONFIG = {
  // Курсы и уроки
  lessons: {
    beginner: 10,        // Простые уроки (Present Simple, базовая лексика)
    intermediate: 20,    // Средние уроки
    advanced: 30,        // Продвинутые уроки
    master: 50,          // Мастер-класс/специализированные курсы
  },
  
  // Тесты
  tests: {
    quiz: 5,             // Быстрые викторины
    test: 15,            // Обычные тесты
    exam: 50,            // Экзамены
    competition: 100,    // Соревнования
  },
  
  // Типы материалов
  materials: {
    grammar: 10,
    vocabulary: 8,
    dialogue: 12,
    reading: 15,
    listening: 15,
    writing: 20,
  }
};

// Отслеживание завершенных активностей (для предотвращения повторного фарма)
class PointsTracker {
  constructor() {
    this.loadCompletedActivities();
  }

  loadCompletedActivities() {
    const stored = localStorage.getItem('completedActivities');
    this.completedActivities = stored ? JSON.parse(stored) : {};
  }

  saveCompletedActivities() {
    localStorage.setItem('completedActivities', JSON.stringify(this.completedActivities));
  }

  // Создает уникальный ID для активности
  createActivityId(type, contentId, userId) {
    return `${type}_${contentId}_${userId}`;
  }

  // Проверяет, была ли уже завершена активность
  isActivityCompleted(type, contentId, userId) {
    const activityId = this.createActivityId(type, contentId, userId);
    return this.completedActivities[activityId] !== undefined;
  }

  // Отмечает активность как завершенную
  markActivityCompleted(type, contentId, userId, pointsEarned) {
    const activityId = this.createActivityId(type, contentId, userId);
    this.completedActivities[activityId] = {
      completedAt: new Date().toISOString(),
      points: pointsEarned,
      type,
      contentId
    };
    this.saveCompletedActivities();
  }

  // Получает историю активностей пользователя
  getUserActivities(userId) {
    const userActivities = [];
    for (const [key, activity] of Object.entries(this.completedActivities)) {
      if (key.includes(`_${userId}`)) {
        userActivities.push(activity);
      }
    }
    return userActivities;
  }

  // Получает общее количество points пользователя
  getUserTotalPoints(userId) {
    const activities = this.getUserActivities(userId);
    return activities.reduce((total, activity) => total + activity.points, 0);
  }

  // Сбросить данные для тестирования
  reset() {
    this.completedActivities = {};
    localStorage.removeItem('completedActivities');
  }
}

export class PointsService {
  constructor() {
    this.tracker = new PointsTracker();
  }

  /**
   * Получает количество points за активность
   * @param {string} type - тип активности (lesson, test, material, competition)
   * @param {string} difficulty - уровень сложности (beginner, intermediate, advanced, master)
   * @returns {number} количество points
   */
  getPointsForActivity(type, difficulty = 'beginner') {
    if (type === 'lesson' || type === 'material') {
      return POINTS_CONFIG.materials[difficulty] || POINTS_CONFIG.lessons[difficulty] || 10;
    }
    if (type === 'test') {
      return POINTS_CONFIG.tests[difficulty] || 15;
    }
    return 10; // значение по умолчанию
  }

  /**
   * Попытается начислить points за активность
   * @param {string} userId - ID пользователя
   * @param {string} type - тип активности
   * @param {string} contentId - ID контента
   * @param {string} difficulty - уровень сложности
   * @returns {object} {success: boolean, points: number, message: string}
   */
  async awardPoints(userId, type, contentId, difficulty = 'beginner') {
    // Проверка на повторное прохождение
    if (this.tracker.isActivityCompleted(type, contentId, userId)) {
      return {
        success: false,
        points: 0,
        message: 'Вы уже получили points за эту активность. Не допускается повторное получение points.'
      };
    }

    const points = this.getPointsForActivity(type, difficulty);

    // Отмечаем активность как завершенную
    this.tracker.markActivityCompleted(type, contentId, userId, points);

    // Отправляем на backend для сохранения
    try {
      const response = await fetch('/api/profile/add-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          points,
          type,
          contentId,
          difficulty
        })
      });

      if (response.ok) {
        return {
          success: true,
          points,
          message: `Поздравляем! Вы заработали ${points} points!`
        };
      } else {
        // Если backend недоступен, используем локальное хранилище
        this.savePointsLocally(userId, points, type, contentId);
        return {
          success: true,
          points,
          message: `Поздравляем! Вы заработали ${points} points!`
        };
      }
    } catch (error) {
      console.error('Error awarding points:', error);
      // Используем локальное хранилище при ошибке
      this.savePointsLocally(userId, points, type, contentId);
      return {
        success: true,
        points,
        message: `Поздравляем! Вы заработали ${points} points!`
      };
    }
  }

  /**
   * Сохраняет points локально в localStorage
   */
  savePointsLocally(userId, points, type, contentId) {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    if (!profile.points) profile.points = 0;
    profile.points += points;
    profile.lastActivityType = type;
    profile.lastActivityId = contentId;
    localStorage.setItem('profile', JSON.stringify(profile));
  }

  /**
   * Получает текущий баланс points пользователя
   */
  async getUserPoints(userId) {
    if (!userId) {
      return 0;
    }

    try {
      const response = await fetch(`/api/profile/${userId}/points`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.points || 0;
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
    }

    // Если backend недоступен, используем локальное хранилище
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    return profile.points || 0;
  }

  /**
   * Получает историю активностей пользователя
   */
  getUserActivityHistory(userId) {
    return this.tracker.getUserActivities(userId);
  }

  /**
   * Получает общее количество points пользователя
   */
  getUserTotalPoints(userId) {
    return this.tracker.getUserTotalPoints(userId);
  }

  /**
   * Получает конфигурацию points
   */
  getPointsConfig() {
    return POINTS_CONFIG;
  }

  /**
   * Проверяет возможность использования points для покупки
   */
  canUsePoints(userId, requiredPoints) {
    const currentPoints = this.getUserTotalPoints(userId);
    return currentPoints >= requiredPoints;
  }

  /**
   * Использует points (например, для покупки курса)
   */
  async usePoints(userId, points, reason = 'purchase') {
    const currentPoints = this.getUserTotalPoints(userId);
    
    if (currentPoints < points) {
      return {
        success: false,
        message: 'Недостаточно points для этого действия'
      };
    }

    try {
      const response = await fetch('/api/profile/use-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          points,
          reason
        })
      });

      if (response.ok) {
        // Обновляем локальное хранилище
        const profile = JSON.parse(localStorage.getItem('profile') || '{}');
        profile.points = (profile.points || 0) - points;
        localStorage.setItem('profile', JSON.stringify(profile));

        return {
          success: true,
          message: `${points} points успешно использованы`
        };
      }
    } catch (error) {
      console.error('Error using points:', error);
      return {
        success: false,
        message: 'Ошибка при использовании points'
      };
    }
  }

  /**
   * Получает информацию о достижениях
   */
  getAchievements(userId) {
    const activities = this.tracker.getUserActivities(userId);
    const totalPoints = this.tracker.getUserTotalPoints(userId);
    const activityCount = activities.length;

    const achievements = [];

    // Достижение: Первый шаг
    if (activityCount >= 1) {
      achievements.push({
        id: 'first_step',
        name: 'Первый шаг',
        description: 'Завершите первую активность',
        icon: '🎯',
        unlocked: true
      });
    }

    // Достижение: 100 points
    if (totalPoints >= 100) {
      achievements.push({
        id: 'hundred_points',
        name: '100 Points',
        description: 'Заработайте 100 points',
        icon: '🌟',
        unlocked: true
      });
    }

    // Достижение: 500 points
    if (totalPoints >= 500) {
      achievements.push({
        id: 'five_hundred_points',
        name: '500 Points',
        description: 'Заработайте 500 points',
        icon: '💎',
        unlocked: true
      });
    }

    // Достижение: 1000 points
    if (totalPoints >= 1000) {
      achievements.push({
        id: 'thousand_points',
        name: '1000 Points',
        description: 'Заработайте 1000 points',
        icon: '👑',
        unlocked: true
      });
    }

    // Достижение: Пятидневная серия
    const lastFiveDays = activities.filter(a => {
      const actDate = new Date(a.completedAt);
      const daysDiff = (new Date() - actDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 5;
    });

    if (lastFiveDays.length >= 5) {
      achievements.push({
        id: 'five_day_streak',
        name: 'Пятидневная серия',
        description: 'Завершите 5 активностей за 5 дней',
        icon: '🔥',
        unlocked: true
      });
    }

    return achievements;
  }
}

// Создаем экспортируемый экземпляр
export const pointsService = new PointsService();

export default pointsService;
