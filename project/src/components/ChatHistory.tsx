import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
  darkMode: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading, darkMode }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div 
      className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold mb-2">CDP Support Assistant</h2>
          <p className="max-w-md">
            Ask me how-to questions about Segment, mParticle, Lytics, or Zeotap. I'll help you find the information you need.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded-lg text-sm`}>How do I set up a new source in Segment?</div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded-lg text-sm`}>How can I create a user profile in mParticle?</div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded-lg text-sm`}>How do I build an audience segment in Lytics?</div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-3 rounded-lg text-sm`}>How can I integrate my data with Zeotap?</div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} darkMode={darkMode} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-600 mr-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className={`py-3 px-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatHistory;