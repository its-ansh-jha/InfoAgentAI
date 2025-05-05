import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { useChat } from '@/context/ChatContext';
import { useChatHistory } from '@/context/ChatHistoryContext';
import { Loader2 } from 'lucide-react';

export function ChatContainer() {
  const { messages, isLoading } = useChat();
  const { updateCurrentChat } = useChatHistory();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Update chat history when messages change
  useEffect(() => {
    // Only update if there are messages to save
    if (messages.length > 0) {
      updateCurrentChat(messages);
    }
  }, [messages, updateCurrentChat]);

  return (
    <main className="flex-grow container mx-auto px-4 py-6 overflow-auto bg-background subtle-grid">
      <div className="max-w-3xl mx-auto space-y-6 relative">
        {/* Subtle indicator line */}
        <div className="absolute top-0 left-0 w-[2px] h-full bg-primary bg-opacity-10"></div>
        
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white flex-shrink-0 mt-1 bg-opacity-80">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="bg-secondary rounded-lg p-4 shadow-md professional-border">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}
