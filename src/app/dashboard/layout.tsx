'use client';

import { useState, useEffect } from 'react';
import { conversationApi } from '@/services/api';
import { ConversationProvider, useConversation } from '@/contexts/ConversationContext';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { 
    conversations, 
    setConversations, 
    selectedConversation, 
    setSelectedConversation,
    isNewConversationModalOpen,
    setIsNewConversationModalOpen,
    setCurrentConversation
  } = useConversation();

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
      const data = await conversationApi.listConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversationDetails = async (id: number) => {
    try {
      const conversation = await conversationApi.getConversation(id);
      setCurrentConversation(conversation);
    } catch (error) {
      console.error('Failed to load conversation details:', error);
    }
  };

  const handleCreateNewConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement;
    const title = titleInput.value.trim();
    
    if (!title) return;

    try {
      const newConversation = await conversationApi.createConversation(title);
      await loadConversations();
      setSelectedConversation(newConversation.id);
      setIsNewConversationModalOpen(false);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col bg-gray-50">
      
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
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
          
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Recent Conversations
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400 mt-1">Create your first conversation</p>
                </div>
              ) : (
                <div className="space-y-1 p-4">
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white">
          {children}
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
                  name="title"
                  type="text"
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
                  className="px-4 py-2 bg-up-maroon text-white rounded-lg hover:bg-up-maroon-dark"
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConversationProvider>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </ConversationProvider>
  );
} 