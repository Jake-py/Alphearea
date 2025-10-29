import React, { useState, useEffect } from 'react'

function NeonTitle({ tag = 'h1' }) {
  const [animationState, setAnimationState] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState(prev => (prev + 1) % 4)
    }, 800)
    return () => clearInterval(interval)
  }, [])

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
      className="neon-title"
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
