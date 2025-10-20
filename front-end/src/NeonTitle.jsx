import React, { useState, useEffect } from 'react'

function NeonTitle({ tag = 'h1' }) {
  const [neonColor, setNeonColor] = useState('#dda0dd')

  useEffect(() => {
    const colors = ['#dda0dd', '#ffffff']
    let index = 0
    const interval = setInterval(() => {
      setNeonColor(colors[index])
      index = (index + 1) % colors.length
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const Tag = tag

  return (
    <Tag className="neon-title" style={{ color: neonColor, textShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}, 0 0 30px ${neonColor}` }}>
      Alphearea
    </Tag>
  )
}

export default NeonTitle
