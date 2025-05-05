import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Chat, Message } from '@/types';
import { nanoid } from 'nanoid';
import { getSystemMessage, getWelcomeMessage } from '@/utils/helpers';

interface ChatHistoryContextType {
  chats: Chat[];
  currentChatId: string | null;
  currentChat: Chat | null;
  startNewChat: () => void;
  loadChat: (chatId: string) => void;
  updateCurrentChat: (messages: Message[]) => void;
  deleteChat: (chatId: string) => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'infoagent-chat-history';

export const ChatHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load chats from localStorage on initial render
  useEffect(() => {
    const savedChats = localStorage.getItem(STORAGE_KEY);
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats) as Chat[];
        setChats(parsedChats);
        
        // Set the most recent chat as current
        if (parsedChats.length > 0) {
          const sortedChats = [...parsedChats].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setCurrentChatId(sortedChats[0].id);
        }
      } catch (error) {
        console.error('Failed to parse saved chats:', error);
        // If parsing fails, start fresh
        startNewChat();
      }
    } else {
      // If no saved chats, start a new chat
      startNewChat();
    }
  }, []);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }
  }, [chats]);

  const startNewChat = useCallback(() => {
    const systemMessage = getSystemMessage();
    const welcomeMessage = getWelcomeMessage('GPT-4o-mini');
    
    const newChat: Chat = {
      id: nanoid(),
      title: 'New Conversation',
      messages: [welcomeMessage],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChatId(newChat.id);
    
    return newChat;
  }, []);

  const loadChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const updateCurrentChat = useCallback((messages: Message[]) => {
    if (!currentChatId) return;
    
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === currentChatId) {
          // Generate a title from the first user message if it's a new chat with default title
          let title = chat.title;
          if (title === 'New Conversation' && messages.length >= 3) {
            const firstUserMessage = messages.find(m => m.role === 'user');
            if (firstUserMessage) {
              // Use the first 5-10 words for the title
              title = firstUserMessage.content
                .split(' ')
                .slice(0, Math.min(8, firstUserMessage.content.split(' ').length))
                .join(' ');
              
              // Add ellipsis if the content was truncated
              if (firstUserMessage.content.split(' ').length > 8) {
                title += '...';
              }
            }
          }
          
          return {
            ...chat,
            messages,
            title,
            updatedAt: new Date().toISOString()
          };
        }
        return chat;
      });
    });
  }, [currentChatId]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prevChats => {
      const filteredChats = prevChats.filter(chat => chat.id !== chatId);
      
      // If the deleted chat was the current one, select another chat
      if (chatId === currentChatId && filteredChats.length > 0) {
        setCurrentChatId(filteredChats[0].id);
      } else if (filteredChats.length === 0) {
        // If no chats left, create a new one
        startNewChat();
      }
      
      return filteredChats;
    });
  }, [currentChatId, startNewChat]);

  // Get the current chat object
  const currentChat = chats.find(chat => chat.id === currentChatId) || null;

  const value = {
    chats,
    currentChatId,
    currentChat,
    startNewChat,
    loadChat,
    updateCurrentChat,
    deleteChat
  };

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = (): ChatHistoryContextType => {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};