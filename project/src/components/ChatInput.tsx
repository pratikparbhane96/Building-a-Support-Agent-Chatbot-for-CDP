import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  darkMode: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, darkMode }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (without Shift key)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(message);
        setMessage('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4 w-full`}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a how-to question about CDPs..."
        className={`flex-1 py-3 px-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          darkMode 
            ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
        } border`}
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`bg-blue-500 text-white rounded-r-lg py-3 px-4 h-full ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Send size={20} />
        )}
      </button>
    </form>
  );
};

export default ChatInput;