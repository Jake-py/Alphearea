import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePoints } from '../hooks/usePoints';
import AdvancedGlitchText from '../components/AdvancedGlitchText';
import GlitchText from '../components/GlitchText';

const Main = () => {
  const { t } = useTranslation();
  const [points, setPoints] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Animate points counter
    const interval = setInterval(() => {
      setPoints(prev => prev < 30 ? prev + 1 : 30);
    }, 50);

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    // Main Container
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Alphearea Title */}
      {/* <div className="absolute top-4 left-4 z-20">
        <AdvancedGlitchText text="Alphearea" />
      </div> */}

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-move 1.5s linear infinite'
        }}></div>
      </div>
      

      {/* Glitch Lines */}
      {isGlitching && (
        <>
          <div className="absolute top-1/4 left-0 w-full h-1 bg-cyan-400 opacity-70 animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-pink-500 opacity-60 animate-pulse"></div>
          <div className="absolute top-3/4 left-0 w-full h-1 bg-green-400 opacity-50 animate-pulse"></div>
        </>
      )}

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-5xl">
          {/* Main Title with Glitch */}
          <h2 className={`text-7xl font-black mb-6 glitch-title ${isGlitching ? 'glitching' : ''}`} data-text={t('main.welcome')}>
            {t('main.welcome')}
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-cyan-300 mb-4 animate-fade-in">
            {t('main.description')}
          </p>

          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('main.learn')}
          </p>

          {/* CTA Button */}
          <button className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold text-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 mb-16" style={{ animation: 'button-idle-glitch 1.5s linear infinite' }}>
            <span className="relative z-10">{t('main.startLearning')}</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="absolute inset-0 glitch-overlay"></div>
          </button>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Card 1 */}
            <div className="feature-card group">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="text-xl font-bold mb-2 text-cyan-400">{t('main.languagesTitle')}</h3>
              <p className="text-gray-300 text-sm">{t('main.languagesDescription')}</p>
            </div>

            {/* Card 2 */}
            <div className="feature-card group">
              <div className="text-4xl mb-2">🧮</div>
              <h3 className="text-xl font-bold mb-2 text-purple-400">{t('main.mathTitle')}</h3>
              <p className="text-gray-300 text-sm">{t('main.mathDescription')}</p>
            </div>

            {/* Card 3 */}
            <div className="feature-card group">
              <div className="text-4xl mb-2">🤖</div>
              <h3 className="text-xl font-bold mb-2 text-pink-400">{t('main.aiTitle')}</h3>
              <p className="text-gray-300 text-sm">{t('main.aiDescription')}</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="stat-item">
              <div className="text-4xl font-black text-cyan-400 glitch-number">1000+</div>
              <div className="text-sm text-gray-400 mt-2" style ={{ animation: 'stat-idle-glitch 1.5s linear infinite' }}>{t('main.stats.students')}</div>
            </div>
            <div className="stat-item">
              <div className="text-4xl font-black text-purple-400 glitch-number">50+</div>
              <div className="text-sm text-gray-400 mt-2" style ={{ animation: 'stat-idle-glitch 1.5s linear infinite' }}>{t('main.stats.courses')}</div>
            </div>
            <div className="stat-item">
              <div className="text-4xl font-black text-pink-400 glitch-number">95%</div>
              <div className="text-sm text-gray-400 mt-2" style ={{ animation: 'stat-idle-glitch 1.5s linear infinite' }}>{t('main.stats.success')}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
