import React, { useState } from 'react';

function MobileChat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, user: true }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setMessages([...newMessages, { text: 'Это тестовый ответ AI', user: false }]);
    }, 1000);
  };

  return (
    <div className="mobile-chat">
      <div className="mobile-chat-header">
        <h3>AI Ассистент</h3>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="mobile-chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`mobile-message ${msg.user ? 'user' : 'ai'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="mobile-chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Спросите что-нибудь..."
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
}

export default MobileChat;
