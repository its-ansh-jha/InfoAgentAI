import React, { createContext, useState, useContext, useCallback } from 'react';
import { Message, ModelType } from '@/types';
import { sendMessage } from '@/utils/api';
import { getSystemMessage, getWelcomeMessage } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  model: ModelType;
  setModel: (model: ModelType) => void;
  sendUserMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Only add welcome message to UI messages, keep system message separate
  const [messages, setMessages] = useState<Message[]>([
    getWelcomeMessage('GPT-4o-mini')
  ]);
  
  // Store system message for API requests but don't display it
  const systemMessage = getSystemMessage();
  const [model, setModel] = useState<ModelType>('gpt-4o-mini');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendUserMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content,
      model,
      timestamp: new Date().toISOString(),
    };

    // Add user message to the chat
    setMessages(prev => [...prev, userMessage]);
    
    // Show loading state
    setIsLoading(true);

    try {
      // Get current messages at the time of sending, including system message for AI context
      const currentMessages = [systemMessage, ...messages, userMessage];
      const aiResponse = await sendMessage(content, model, currentMessages);
      
      // Add AI response to the chat
      setMessages(prev => [
        ...prev, 
        {
          ...aiResponse,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get a response from the AI',
        variant: 'destructive',
      });
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again later.',
          model,
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [model, toast]);

  const clearMessages = useCallback(() => {
    setMessages([
      getWelcomeMessage(model === 'gpt-4o-mini' ? 'GPT-4o-mini' : 'DeepSeek R1')
    ]);
  }, [model]);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      isLoading, 
      model, 
      setModel, 
      sendUserMessage,
      clearMessages 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
