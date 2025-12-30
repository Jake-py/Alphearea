import React, { useState, useEffect, useRef } from 'react'
import { heavyAnimationsEnabled } from '../config/animations'

function NeonTitle({ tag = 'h1' }) {
  const [animationState, setAnimationState] = useState(0)
  const [loadGlitch, setLoadGlitch] = useState(true)
  const ref = useRef(null)
  const enabled = heavyAnimationsEnabled();

  useEffect(() => {
    // Load glitch effect
    const timer = setTimeout(() => setLoadGlitch(false), 400)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!enabled) return; // respects prefers-reduced-motion and flag

    let animationFrameId;
    let lastTime = performance.now();
    let paused = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { paused = !e.isIntersecting; });
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);

    const update = (now) => {
      if (!paused && now - lastTime >= 800) {
        setAnimationState(prev => (prev + 1) % 4);
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (ref.current) observer.disconnect();
    };
  }, [enabled]);


  const Tag = tag

  const getTransform = () => {
    switch (animationState) {
      case 0: return 'perspective(500px) rotateX(0deg) rotateY(0deg)'
      case 1: return 'perspective(500px) rotateX(5deg) rotateY(5deg) scale(1.02)'
      case 2: return 'perspective(500px) rotateX(-5deg) rotateY(-5deg) scale(1.05)'
      case 3: return 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1.03)'
      default: return 'perspective(500px) rotateX(0deg) rotateY(0deg)'
    }
  }

  return (
    <Tag
      className={`neon-title ${loadGlitch ? 'load-glitch' : ''}`}
      style={{
        transform: getTransform(),
        transition: 'transform 0.8s ease-in-out'
      }}
    >
      Alphearea
    </Tag>
  )
}

export default NeonTitle
