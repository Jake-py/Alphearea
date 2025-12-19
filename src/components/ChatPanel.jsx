import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/api.js';
import '../styles/ChatPanel.css';

function ChatPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const data = await response.json();
      if (response.ok) {
        const aiMessage = { text: data.response, sender: 'ai' };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setMessages(prev => [...prev, { text: 'Error: Unable to get response', sender: 'ai' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Error: Реши проблему с сервером или интернетом', sender: 'ai' }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>Gemini AI</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && <div className="message ai loading">Думаю...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Спроси кое что, но в пределах своих возможностей) ..."
          className="input-field"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          enterKeyHint="send"
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}
          className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
