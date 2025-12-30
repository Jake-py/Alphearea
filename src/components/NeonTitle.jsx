import React, { useState, useEffect, useRef, useCallback } from 'react'
import { heavyAnimationsEnabled } from '../config/animations'

function NeonTitle({ tag = 'h1' }) {
  const [animationState, setAnimationState] = useState(0)
  const [loadGlitch, setLoadGlitch] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const ref = useRef(null)
  const enabled = heavyAnimationsEnabled();
  const animationFrameId = useRef(null);
  const lastTime = useRef(performance.now());
  const paused = useRef(false);

  useEffect(() => {
    // Load glitch effect
    const timer = setTimeout(() => setLoadGlitch(false), 400)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!enabled || !isVisible) {
      // Если анимация отключена или компонент невидим, ничего не делаем
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    // IntersectionObserver для pause анимации когда компонент вне видимости
    const observer = new IntersectionObserver((entries) => {
      paused.current = !entries[0].isIntersecting;
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);

    const update = (now) => {
      if (!paused.current && now - lastTime.current >= 800) {
        setAnimationState(prev => (prev + 1) % 4);
        lastTime.current = now;
      }
      animationFrameId.current = requestAnimationFrame(update);
    };

    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (ref.current) observer.disconnect();
    };
  }, [enabled, isVisible]);

  // Попытка определить видимость через ResizeObserver (fallback для старых браузеров)
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setIsVisible(rect.top < window.innerHeight && rect.bottom > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Первая проверка
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const Tag = tag

  const getTransform = useCallback(() => {
    switch (animationState) {
      case 0: return 'perspective(500px) rotateX(0deg) rotateY(0deg)'
      case 1: return 'perspective(500px) rotateX(5deg) rotateY(5deg) scale(1.02)'
      case 2: return 'perspective(500px) rotateX(-5deg) rotateY(-5deg) scale(1.05)'
      case 3: return 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1.03)'
      default: return 'perspective(500px) rotateX(0deg) rotateY(0deg)'
    }
  }, [animationState])

  return (
    <Tag
      className={`neon-title ${loadGlitch ? 'load-glitch' : ''}`}
      ref={ref}
      style={{
        transform: getTransform(),
        transition: 'transform 0.8s ease-in-out',
        willChange: 'transform'
      }}
    >
      Alphearea
    </Tag>
  )
}

export default NeonTitle
