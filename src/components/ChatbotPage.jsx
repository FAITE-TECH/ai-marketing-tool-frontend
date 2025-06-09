import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Get token from localStorage (assumes auth is stored there)
  const token = localStorage.getItem('access_token');

  // Initialize session ID
  useEffect(() => {
    const existingSession = localStorage.getItem('chat_session_id');
    if (existingSession) {
      setSessionId(existingSession);
    } else {
      const newSession = uuidv4();
      localStorage.setItem('chat_session_id', newSession);
      setSessionId(newSession);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setIsTyping(true);
    const userMessage = input;
    setInput('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/chatbot/chat',
        {
          session_id: sessionId,
          message: userMessage
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const botReply = response.data.response;
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 bg-gray-50 p-6 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 bg-white rounded-2xl shadow-xl space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-md text-sm shadow-md ${
                    msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-gray-200 text-gray-700 italic shadow-md">
                  Bot is typing...
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FaPaperPlane /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
