import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaPaperPlane } from 'react-icons/fa';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [file, setFile] = useState(null);

  const sendMessage = async () => {
    if (!input && !file) return;

    const userMessage = file
      ? { sender: 'user', text: `Uploaded file: ${file.name}` }
      : { sender: 'user', text: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setFile(null);
    setIsTyping(true);

    try {
      let responseText = '';

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/api/upload-file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        responseText = response.data.reply;
      } else {
        const response = await axios.post('/api/chat', { message: input });
        responseText = response.data.reply;
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'bot', text: responseText }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, an error occurred.' },
      ]);
      setIsTyping(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar space reserved by layout */}
      <div className="flex-1 bg-gray-50 p-6 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 bg-white rounded-2xl shadow-xl space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-md text-sm shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
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
              disabled={!!file}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={file ? 'File selected' : 'Type a message...'}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300"
            >
              <FaUpload /> Upload
            </label>
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
