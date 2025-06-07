'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { conversationApi, SimpleConversation, Conversation, Message } from '@/services/api';

export default function DashboardPage() {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<SimpleConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load conversation details when selectedConversation changes
  useEffect(() => {
    if (selectedConversation) {
      loadConversationDetails(selectedConversation);
    } else {
      setCurrentConversation(null);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const data = await conversationApi.listConversations();
      setConversations(data);
      setError(null);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setError('Failed to load conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadConversationDetails = async (id: number) => {
    try {
      const conversation = await conversationApi.getConversation(id);
      setCurrentConversation(conversation);
      setError(null);
    } catch (error) {
      console.error('Failed to load conversation details:', error);
      setError('Failed to load conversation details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Get AI response from backend
      const aiResponse = await conversationApi.getAIResponse(selectedConversation, message);
      
      // Clear input
      setMessage('');
      
      // Reload the conversation to get the updated messages
      await loadConversationDetails(selectedConversation);
      
      // Update the conversation list to reflect the new last message timestamp
      await loadConversations();
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConversationTitle.trim()) return;

    try {
      const newConversation = await conversationApi.createConversation(newConversationTitle);
      
      // Add the new conversation to the list
      await loadConversations();
      
      // Select the new conversation
      setSelectedConversation(newConversation.id);
      
      // Reset modal state
      setNewConversationTitle('');
      setIsNewConversationModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      setError('Failed to create conversation');
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
          {error}
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Toggle Button - Mobile Only */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-up-maroon text-white p-3 rounded-full shadow-lg hover:bg-up-maroon-dark transition-colors duration-200"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-4 border-b border-gray-200">
            <button 
              onClick={() => setIsNewConversationModalOpen(true)}
              className="w-full bg-up-maroon text-white py-3 px-4 rounded-lg hover:bg-up-maroon-dark transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Conversation
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Recent Conversations
              </h2>
              
              {isLoadingConversations ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-16 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400 mt-1">Create your first conversation</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversation(conv.id);
                        setIsSidebarOpen(false); // Close sidebar on mobile after selection
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-colors duration-200 ${
                        selectedConversation === conv.id
                          ? 'bg-up-maroon bg-opacity-10 border border-up-maroon'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900 truncate text-sm">{conv.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation && currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentConversation.title}
                </h1>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentConversation.messages && currentConversation.messages.length === 0 ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-up-maroon flex items-center justify-center text-white font-medium">
                      AI
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <p className="text-gray-900">Hello! How can I help you today?</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ) : (
                  currentConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-up-maroon flex items-center justify-center text-white font-medium">
                          AI
                        </div>
                      )}
                      <div className={`flex-1 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                        <div
                          className={`rounded-lg p-3 max-w-[80%] ${
                            msg.role === 'assistant'
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-up-maroon text-white'
                          }`}
                        >
                          <div>{formatMessageContent(msg.content)}</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
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
                  <div className="flex items-start gap-3">
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
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-up-maroon focus:border-transparent text-gray-900 placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className={`px-6 py-3 bg-up-maroon text-white rounded-lg hover:bg-up-maroon-dark transition-colors duration-200 flex items-center gap-2 ${
                      (isLoading || !message.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          ) : selectedConversation && !currentConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-up-maroon border-t-transparent rounded-full"></div>
            </div>
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
      </div>

      {/* New Conversation Modal */}
      {isNewConversationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">New Conversation</h2>
              <button
                onClick={() => setIsNewConversationModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateNewConversation}>
              <div className="mb-4">
                <label htmlFor="conversation-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Conversation Title
                </label>
                <input
                  id="conversation-title"
                  type="text"
                  value={newConversationTitle}
                  onChange={(e) => setNewConversationTitle(e.target.value)}
                  placeholder="Enter a title for your conversation"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-up-maroon focus:border-transparent text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewConversationModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newConversationTitle.trim()}
                  className={`px-4 py-2 bg-up-maroon text-white rounded-lg ${
                    !newConversationTitle.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-up-maroon-dark'
                  }`}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 