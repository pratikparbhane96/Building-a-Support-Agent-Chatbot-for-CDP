import React from 'react';
import { Message } from '../types';
import { MessageSquare, Bot } from 'lucide-react';
import { marked } from 'marked';

interface ChatMessageProps {
  message: Message;
  darkMode: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, darkMode }) => {
  const isUser = message.role === 'user';
  
  // Configure marked for dark mode
  const renderer = new marked.Renderer();
  
  // Custom renderer for code blocks
  renderer.code = (code, language) => {
    const darkModeClass = darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800';
    return `<pre class="p-3 rounded-md my-2 overflow-x-auto ${darkModeClass}"><code class="${language}">${code}</code></pre>`;
  };
  
  // Custom renderer for tables
  renderer.table = (header, body) => {
    const darkModeClass = darkMode ? 'border-gray-700' : 'border-gray-300';
    return `<table class="border-collapse w-full my-4 ${darkModeClass}">
      <thead>${header}</thead>
      <tbody>${body}</tbody>
    </table>`;
  };
  
  renderer.tablerow = (content) => {
    return `<tr>${content}</tr>`;
  };
  
  renderer.tablecell = (content, { header }) => {
    const darkModeClass = darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white';
    const type = header ? 'th' : 'td';
    const align = header ? 'text-left' : '';
    return `<${type} class="border ${darkModeClass} px-4 py-2 ${align}">${content}</${type}>`;
  };
  
  // Custom renderer for links
  renderer.link = (href, title, text) => {
    const darkModeClass = darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800';
    return `<a href="${href}" title="${title || ''}" class="${darkModeClass} underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
  };
  
  // Parse markdown in assistant messages with custom renderer
  const markedOptions = {
    renderer,
    breaks: true,
    gfm: true
  };
  
  const content = isUser 
    ? message.content 
    : <div dangerouslySetInnerHTML={{ __html: marked(message.content, markedOptions as any) }} />;
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${isUser ? 'bg-blue-500 ml-3' : 'bg-gray-600 mr-3'}`}>
          {isUser ? <MessageSquare size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
        </div>
        <div className={`py-3 px-4 rounded-lg ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'
        }`}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;