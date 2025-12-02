// src/Main.jsx
import React from 'react';
import { usePoints } from '../hooks/usePoints';

function Main() {
  return (
    <div className="main-page">
      <h2>Добро пожаловать в Alphearea!</h2>

      <div style={{ marginBottom: '30px', lineHeight: '1.6' }}>
        <p>
          <strong>Alphearea</strong> — это современная образовательная платформа, созданная для эффективного обучения.
          Здесь вы найдете курсы по английскому, корейскому и русскому языкам, интерактивные тесты,
          материалы для самообучения и многое другое.
        </p>
        <p>
          Зарабатывайте points за обучение, отслеживайте свой прогресс и получайте достижения!
          Выберите раздел для изучения в боковом меню слева.
        </p>
      </div>
    </div>
  )
}

export default Main
