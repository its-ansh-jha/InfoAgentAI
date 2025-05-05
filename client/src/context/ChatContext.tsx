import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { Message } from '@/types';
import { sendMessage, sendMessageWithImage, uploadImage } from '@/utils/api';
import { getSystemMessage } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';
import { useChatHistory } from '@/context/ChatHistoryContext';

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendUserMessage: (content: string, imageFile?: File | null) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Get current chat from ChatHistoryContext
  const { currentChat, updateCurrentChat, startNewChat } = useChatHistory();

  // Update local messages when currentChat changes
  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages);
    } else {
      // If no current chat, create a new one
      startNewChat();
    }
  }, [currentChat, startNewChat]);

  // Store system message for API requests but don't display it
  const systemMessage = getSystemMessage();

  const sendUserMessage = useCallback(async (content: string, imageFile?: File | null) => {
    if (!content.trim() && !imageFile) return;

    // Process any uploaded image file
    let imageData: string | null = null;
    if (imageFile) {
      try {
        // Get base64 representation of the image
        imageData = await uploadImage(imageFile);
        console.log('Image uploaded successfully');
      } catch (error) {
        console.error('Failed to process image:', error);
        toast({
          title: 'Image Upload Error',
          description: 'Failed to process the image. Please try again.',
          variant: 'destructive',
        });
        return;
      }
    }

    // Create the message content based on whether there's an image
    let messageContent: string | Array<{type: string, text?: string, image_data?: string}> = content;
    
    if (imageFile && imageData) {
      // Store a text representation in the UI for the user's message
      messageContent = `[Image attached] ${content}`;
    }

    const userMessage: Message = {
      role: 'user',
      content: messageContent,
      model: 'llama-4-maverick',
      timestamp: new Date().toISOString(),
    };

    // Add user message to the chat
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    updateCurrentChat(updatedMessages);
    
    // Show loading state
    setIsLoading(true);

    try {
      // Get current messages at the time of sending, including system message for AI context
      const currentMessages = [systemMessage, ...messages, userMessage];
      
      let aiResponse;
      
      if (imageFile && imageData) {
        // Use the image-enabled API call
        aiResponse = await sendMessageWithImage(
          content, 
          imageData, 
          'llama-4-maverick', 
          currentMessages
        );
      } else {
        // Use regular text API call
        aiResponse = await sendMessage(
          content, 
          'llama-4-maverick', 
          currentMessages
        );
      }
      
      // Add AI response to the chat
      const newMessage: Message = {
        ...aiResponse,
        timestamp: new Date().toISOString()
      };
      
      const finalMessages = [...updatedMessages, newMessage];
      setMessages(finalMessages);
      updateCurrentChat(finalMessages);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get a response from the AI',
        variant: 'destructive',
      });
      
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again later.',
        model: 'llama-4-maverick',
        timestamp: new Date().toISOString(),
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      updateCurrentChat(finalMessages);
    } finally {
      setIsLoading(false);
    }
  }, [messages, toast, updateCurrentChat, systemMessage]);

  const clearMessages = useCallback(() => {
    // Create a new chat instead of clearing messages
    startNewChat();
  }, [startNewChat]);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      isLoading, 
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
