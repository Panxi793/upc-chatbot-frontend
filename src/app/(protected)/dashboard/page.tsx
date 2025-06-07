'use client';

import { useState, useRef, useEffect } from 'react';
import { conversationApi } from '@/services/api';
import { useConversation } from '@/contexts/ConversationContext';

export default function DashboardPage() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentConversation, setCurrentConversation } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentConversation) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Get AI response from backend
      const aiResponse = await conversationApi.getAIResponse(currentConversation.id, message);
      
      // Clear input
      setMessage('');
      
      // Reload the conversation to get the updated messages
      const updatedConversation = await conversationApi.getConversation(currentConversation.id);
      setCurrentConversation(updatedConversation);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageContent = (content: string) => {
    // Handle formatting for AI responses with bullet points and line breaks
    return content.split('\n').map((line, index) => (
      <div key={index} className={line.trim() === '' ? 'h-2' : ''}>
        {line.trim() !== '' && <span>{line}</span>}
      </div>
    ));
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages?.length, isLoading]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
          {error}
        </div>
      )}

      {currentConversation ? (
        <>
          {/* Chat Header */}
          <div className="p-2 md:p-4 border-b border-gray-200 bg-white">
            <h1 className="md:text-xl pl-2 sm:text-md text-sm font-semibold text-gray-900">
              {currentConversation.title}
            </h1>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentConversation.messages && currentConversation.messages.length === 0 ? (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-up-maroon flex items-center justify-center text-white font-medium">
                  AI
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-gray-900 text-[0.8rem] sm:text-xs md:text-sm">Hello! How can I help you today?</p>
                  </div>
                  <p className="text-[0.6rem] sm:text-xs text-gray-500 mt-1">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ) : (
              currentConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-up-maroon flex items-center justify-center text-white font-medium">
                      AI
                    </div>
                  )}
                  <div className={`flex-1 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                    <div
                      className={`rounded-lg p-3 text-[0.8rem] sm:text-xs md:text-sm max-w-[80%] ${
                        msg.role === 'assistant'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-up-maroon text-white'
                      }`}
                    >
                      <div>{formatMessageContent(msg.content)}</div>
                    </div>
                    <p className="text-[0.6rem] sm:text-xs text-gray-500 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      U
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-up-maroon flex items-center justify-center text-white font-medium">
                  AI
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 md:p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 p-1 text-sm md:text-base md:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-up-maroon focus:border-transparent text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className={`px-2 sm:px-6 py-2 text-[0.8rem] sm:text-xs md:text-sm bg-up-maroon text-white rounded-lg hover:bg-up-maroon-dark transition-colors duration-200 flex items-center gap-1 sm:gap-2 ${
                  (isLoading || !message.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-3 w-3 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send
                  </>
                )}
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-up-maroon bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-up-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Conversation</h2>
            <p className="text-gray-500">Choose a conversation from the sidebar or start a new one</p>
          </div>
        </div>
      )}
    </div>
  );
} 