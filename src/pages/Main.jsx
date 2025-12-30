import React, { useState, useEffect, useRef } from 'react';
import { usePoints } from '../hooks/usePoints';
import { heavyAnimationsEnabled } from '../config/animations';

const Main = () => {
  const [points, setPoints] = useState(30);

  useEffect(() => {
    // Просто показываем статичное значение
  }, []);

  return (
    // Main Container
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Alphearea Title — статичный неон */}

{/* Фоновая сетка — без анимаций */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-5xl">
          {/* Main Title — статичный неон */}
          <h2 className="text-7xl font-black mb-6 neon-title">
            Добро пожаловать в Alphearea!
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-cyan-300 mb-4">
            Современная образовательная платформа для эффективного обучения
          </p>

          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Изучайте английский, корейский и русский языки, математику, программирование и многое другое.
            Зарабатывайте points за обучение, отслеживайте свой прогресс и получайте достижения!
          </p>

          {/* CTA Button */}
          <button className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold text-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 mb-16">
            <span className="relative z-10">Начать обучение</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Card 1 */}
            <div className="feature-card group">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="text-xl font-bold mb-2 text-cyan-400">3 языка</h3>
              <p className="text-gray-300 text-sm">Английский, корейский и русский с интерактивными тестами</p>
            </div>

            {/* Card 2 */}
            <div className="feature-card group">
              <div className="text-4xl mb-2">🧮</div>
              <h3 className="text-xl font-bold mb-2 text-purple-400">Математика & Наука</h3>
              <p className="text-gray-300 text-sm">От базовых вычислений до продвинутого программирования</p>
            </div>

            {/* Card 3 */}
            <div className="feature-card group">
              <div className="text-4xl mb-2">🤖</div>
              <h3 className="text-xl font-bold mb-2 text-pink-400">ИИ-ассистент</h3>
              <p className="text-gray-300 text-sm">Помощник на основе Gemini для персонального обучения</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="stat-item">
              <div className="text-4xl font-black text-cyan-400">1000+</div>
              <div className="text-sm text-gray-400 mt-2">Активных студентов</div>
            </div>
            <div className="stat-item">
              <div className="text-4xl font-black text-purple-400">50+</div>
              <div className="text-sm text-gray-400 mt-2">Курсов</div>
            </div>
            <div className="stat-item">
              <div className="text-4xl font-black text-pink-400">95%</div>
              <div className="text-sm text-gray-400 mt-2">Успешность</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
