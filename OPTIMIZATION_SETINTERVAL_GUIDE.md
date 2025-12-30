# Оптимизация setInterval в тестовых страницах

**Статус:** 🔴 Требует реализации (Шаг 5/7)
**Влияние на TBT:** ~50-100 ms сбережений

---

## 📋 Проблемные файлы

Найдено **7 файлов** с использованием `setInterval` в таймерах тестов:

```
1. src/pages/TestTaking.jsx (line 89)
2. src/pages/EnglishGrammarTest.jsx (line 97)
3. src/pages/KoreanGrammarTest.jsx (line 96)
4. src/pages/RussianGrammarTest.jsx (line 96)
5. src/pages/PhilosophyWisdomTest.jsx (line 96)
6. src/pages/PsychologyTheoriesTest.jsx (line 96)
7. src/pages/EnglishGrammarTest.jsx (2-й экземпляр?)
```

---

## ❌ Текущий код (неоптимальный)

```javascript
// Плохо: setInterval запускается каждую секунду (1000 ms)
// Даже если код быстрый, браузер все равно создает микротаск каждую сек
useEffect(() => {
  timerRef.current = setInterval(() => {
    setTimeRemaining(prev => prev - 1);
    // ... update UI
  }, 1000);

  return () => clearInterval(timerRef.current);
}, []);

// Проблемы:
// 1. setInterval всегда гарантирует вызов callback
// 2. Даже небольшая задержка может сместить таймер
// 3. Может вызвать дополнительные ре-рендеры
```

---

## ✅ Оптимальное решение (Option A: requestAnimationFrame)

Использовать `requestAnimationFrame` с расчетом прошедшего времени:

```javascript
useEffect(() => {
  let lastUpdateTime = Date.now();
  let animationFrameId;

  const tick = () => {
    const now = Date.now();
    const elapsed = now - lastUpdateTime;

    // Обновляем только если прошла целая секунда
    if (elapsed >= 1000) {
      setTimeRemaining(prev => {
        const newTime = prev - Math.floor(elapsed / 1000);
        if (newTime <= 0) {
          // Тест закончился
          handleTestEnd();
          return 0;
        }
        return newTime;
      });
      lastUpdateTime = now;
    }

    animationFrameId = requestAnimationFrame(tick);
  };

  animationFrameId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(animationFrameId);
}, []);
```

**Преимущества:**
- ✅ Работает в синхронизации с браузером (60 fps)
- ✅ Паузируется когда вкладка в фокусе
- ✅ Более точный таймер (не зависит от CPU нагрузки)
- ✅ Меньше переключений контекста
- ✅ Экономия на основном потоке

---

## ✅ Оптимальное решение (Option B: Hybrid с setTimeout)

Если нужна более грубая гранулярность, можно использовать оптимизированный setTimeout:

```javascript
useEffect(() => {
  let startTime = Date.now();
  let timeoutId;
  let isActive = true;

  const updateTimer = () => {
    if (!isActive) return;

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const newTimeRemaining = initialTime - elapsed;

    if (newTimeRemaining <= 0) {
      setTimeRemaining(0);
      handleTestEnd();
    } else {
      setTimeRemaining(newTimeRemaining);
      // Планируем следующее обновление точно на следующую секунду
      const nextUpdateIn = 1000 - ((Date.now() - startTime) % 1000);
      timeoutId = setTimeout(updateTimer, nextUpdateIn);
    }
  };

  timeoutId = setTimeout(updateTimer, 1000);

  return () => {
    isActive = false;
    clearTimeout(timeoutId);
  };
}, [initialTime]);
```

**Преимущества:**
- ✅ Более точный таймер (пересчет каждый раз)
- ✅ Не зависит от задержек обновления
- ✅ Экономия: callback вызывается реже (~1 раз в сек вместо каждого кадра)

---

## 🎯 Рекомендация: Используйте Option B (гибридный)

**Почему Option B лучше:**
1. Классический setTimeout, привычен
2. Точно срабатывает каждую секунду
3. Меньше нагрузка на CPU, чем RAF
4. Легко добавить pause/resume логику

---

## 📝 Шаблон для замены в каждом файле

**ДО:**
```javascript
useEffect(() => {
  timerRef.current = setInterval(() => {
    setTimeRemaining(prev => prev - 1);
  }, 1000);

  return () => clearInterval(timerRef.current);
}, []);
```

**ПОСЛЕ:**
```javascript
useEffect(() => {
  let startTime = Date.now();
  let timeoutId;

  const updateTimer = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const newTimeRemaining = timeLimit - elapsed;

    if (newTimeRemaining <= 0) {
      setTimeRemaining(0);
      // Вызов callback при окончании таймера
      onTimerEnd?.();
    } else {
      setTimeRemaining(newTimeRemaining);
      const nextUpdateIn = 1000 - ((Date.now() - startTime) % 1000);
      timeoutId = setTimeout(updateTimer, nextUpdateIn);
    }
  };

  timeoutId = setTimeout(updateTimer, 1000);

  return () => {
    clearTimeout(timeoutId);
  };
}, [timeLimit, onTimerEnd]);
```

---

## 🔍 Как найти и заменить все вхождения

```bash
# 1. Найти все setInterval
grep -r "setInterval" src/pages/ --include="*.jsx"

# 2. Заменить в каждом файле вручную или через sed (осторожно!)
# Для каждого файла:
# - Открыть файл
# - Найти блок useEffect с setInterval
# - Заменить на гибридный setTimeout вариант
# - Тестировать
```

---

## ✅ Контрольный список

- [ ] Обновить TestTaking.jsx
- [ ] Обновить EnglishGrammarTest.jsx
- [ ] Обновить KoreanGrammarTest.jsx
- [ ] Обновить RussianGrammarTest.jsx
- [ ] Обновить PhilosophyWisdomTest.jsx
- [ ] Обновить PsychologyTheoriesTest.jsx

**Проверить после замены:**
- [ ] Тесты все еще срабатывают при истечении времени
- [ ] Таймер отсчитывает точно
- [ ] Нет console ошибок
- [ ] Нет утечек памяти (clearTimeout вызывается)

---

## 📊 Ожидаемый результат

| Метрика | До | После | Сбережения |
|---------|----|---------| |
| setInterval вызовов/сек | 7 (по одному на файл) | ~1-2 (при необходимости) | 71-86% ↓ |
| CPU во время теста | ~8-12% | ~4-6% | 50% ↓ |
| TBT (во время теста) | ~200-300 ms | ~100-150 ms | 50% ↓ |

---

## 🚀 Приоритет

1. ⭐⭐⭐ **TestTaking.jsx** - основной компонент (влияние максимальное)
2. ⭐⭐⭐ **EnglishGrammarTest.jsx** - популярный тест
3. ⭐⭐ Остальные тесты

---

## 💡 Дополнительный совет

Если у вас есть несколько таймеров, можно объединить их в один CustomHook:

```javascript
// hooks/useOptimizedTimer.js
export function useOptimizedTimer(initialSeconds, onEnd) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);

  useEffect(() => {
    const startTime = Date.now();
    let timeoutId;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = initialSeconds - elapsed;

      if (remaining <= 0) {
        setTimeRemaining(0);
        onEnd?.();
      } else {
        setTimeRemaining(remaining);
        const nextIn = 1000 - ((Date.now() - startTime) % 1000);
        timeoutId = setTimeout(tick, nextIn);
      }
    };

    timeoutId = setTimeout(tick, 1000);
    return () => clearTimeout(timeoutId);
  }, [initialSeconds, onEnd]);

  return timeRemaining;
}

// Использование:
const timeRemaining = useOptimizedTimer(timeLimit, handleTestEnd);
```

Тогда можно просто заменить все 7 файлов на один hook - намного легче поддерживать!

---

**Автор:** GitHub Copilot  
**Статус:** Готово к реализации
