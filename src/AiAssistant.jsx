import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import './AiAssistant.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AiAssistant({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI learning assistant. How can I help you with your courses today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={20} color="#e59819" />
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Smart AI Assistant</h3>
        </div>
        <button onClick={onClose} className="ai-close-btn">
          <X size={20} />
        </button>
      </div>
      
      <div className="ai-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`ai-message-row ${msg.role === 'user' ? 'user-row' : 'ai-row'}`}>
            {msg.role === 'ai' && (
              <div className="ai-avatar">
                <Bot size={16} />
              </div>
            )}
            <div className={`ai-bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble-bot'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="ai-message-row ai-row">
            <div className="ai-avatar">
              <Bot size={16} />
            </div>
            <div className="ai-bubble ai-bubble-bot" style={{ fontStyle: 'italic', opacity: 0.7 }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="ai-input-area">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your courses..."
          className="ai-input"
        />
        <button type="submit" className="ai-send-btn" disabled={isLoading || !input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
