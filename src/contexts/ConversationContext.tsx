'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Conversation, SimpleConversation } from '@/services/api';

interface ConversationContextType {
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  conversations: SimpleConversation[];
  setConversations: (conversations: SimpleConversation[]) => void;
  selectedConversation: number | null;
  setSelectedConversation: (id: number | null) => void;
  isNewConversationModalOpen: boolean;
  setIsNewConversationModalOpen: (isOpen: boolean) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<SimpleConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);

  return (
    <ConversationContext.Provider
      value={{
        currentConversation,
        setCurrentConversation,
        conversations,
        setConversations,
        selectedConversation,
        setSelectedConversation,
        isNewConversationModalOpen,
        setIsNewConversationModalOpen,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
} 