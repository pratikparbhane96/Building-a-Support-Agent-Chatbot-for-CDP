import React, { useState, useEffect } from 'react';
import { Message, CDP } from './types';
import { createMessage } from './utils/chatUtils';
import { processUserMessage } from './services/chatService';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import CDPSelector from './components/CDPSelector';
import { Database, Bot, HelpCircle, Moon, Sun } from 'lucide-react';
import { commonQuestions } from './data/commonQuestions';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCDP, setSelectedCDP] = useState<CDP | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  // Send welcome message when the app loads
  useEffect(() => {
    const welcomeMessage = createMessage(
      "👋 Hello! I'm your CDP Support Assistant. I can help you with questions about Segment, mParticle, Lytics, and Zeotap. What would you like to know today?",
      'assistant'
    );
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage = createMessage(content, 'user');
    setMessages((prev) => [...prev, userMessage]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Process the message and get a response
      const assistantMessage = await processUserMessage(content, messages, selectedCDP);
      
      // Add assistant message to chat
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Handle error
      const errorMessage = createMessage(
        "I'm sorry, I encountered an error while processing your request. Please try again.",
        'assistant'
      );
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Clear loading state
      setIsLoading(false);
    }
  };

  const handleSelectCDP = (cdp: CDP | null) => {
    setSelectedCDP(cdp);
    
    if (cdp) {
      handleSendMessage(`Tell me about ${cdp.name} CDP and what kind of questions I can ask about it.`);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b py-4 px-6 sticky top-0 z-10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="text-blue-500 mr-2" size={24} />
            <h1 className="text-xl font-bold">CDP Support Assistant</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className={`flex items-center text-sm ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => handleSendMessage("What can you help me with?")}
            >
              <HelpCircle size={16} className="mr-1" />
              Help
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-4 hidden md:block overflow-y-auto`}>
          <h2 className="text-lg font-semibold mb-4">CDP Platforms</h2>
          <CDPSelector selectedCDP={selectedCDP} onSelectCDP={handleSelectCDP} darkMode={darkMode} />
          
          <div className="mt-6">
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Common Questions</h3>
            <ul className="space-y-2">
              {commonQuestions.map((question, index) => (
                <li key={index}>
                  <button 
                    className={`text-sm text-left ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'} w-full truncate`}
                    onClick={() => handleSendMessage(question)}
                    title={question}
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6">
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Advanced Questions</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  className={`text-sm text-left ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'} w-full truncate`}
                  onClick={() => handleSendMessage("What are the advanced configuration options for Segment's JavaScript SDK?")}
                >
                  Advanced configuration for Segment's SDK
                </button>
              </li>
              <li>
                <button 
                  className={`text-sm text-left ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'} w-full truncate`}
                  onClick={() => handleSendMessage("How does Segment's audience creation process compare to Lytics'?")}
                >
                  Compare Segment vs Lytics audience creation
                </button>
              </li>
              <li>
                <button 
                  className={`text-sm text-left ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'} w-full truncate`}
                  onClick={() => handleSendMessage("What's the difference between mParticle and Segment for mobile apps?")}
                >
                  mParticle vs Segment for mobile apps
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Chat container */}
        <div className="flex-1 flex flex-col relative">
          <ChatHistory messages={messages} isLoading={isLoading} darkMode={darkMode} />
          <div className="sticky bottom-0 w-full">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;