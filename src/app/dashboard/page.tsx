'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Conversation 1' },
    { id: 2, title: 'Conversation 2' },
    { id: 3, title: 'Conversation 3' },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement message sending logic
    setMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-4">
          <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg mb-4">
            Create New Conversation
          </button>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-2">Existing Conversations</h2>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
              >
                {conv.title}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">Current Conversation Title</h1>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Messages will be displayed here */}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 