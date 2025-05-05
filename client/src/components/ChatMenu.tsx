import React, { useState } from 'react';
import { Menu, PlusCircle, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatHistory } from '../context/ChatHistoryContext';
import { Chat } from '@/types';

export function ChatMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { chats, currentChatId, startNewChat, loadChat } = useChatHistory();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNewChat = () => {
    startNewChat();
    setIsOpen(false);
  };

  const handleChatSelect = (chatId: string) => {
    loadChat(chatId);
    setIsOpen(false);
  };

  // Truncate title to a reasonable length
  const truncateTitle = (title: string, maxLength = 25) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMenu} 
        className="ml-1 mr-3"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background bg-opacity-80" onClick={toggleMenu}>
          <div 
            className="fixed top-0 left-0 h-full w-72 bg-background border-r border-neutral-800 dark-glass p-4 z-50 shadow-lg" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              variant="outline" 
              className="w-full mb-4 flex items-center justify-center gap-2 professional-border"
              onClick={handleNewChat}
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Chat</span>
            </Button>

            <div className="space-y-1 mt-4 overflow-y-auto max-h-[calc(100vh-120px)]">
              {chats.length === 0 ? (
                <p className="text-muted-foreground text-sm p-2">No conversations yet</p>
              ) : (
                chats.map((chat: Chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
                      chat.id === currentChatId 
                        ? 'bg-primary bg-opacity-20 text-foreground' 
                        : 'hover:bg-secondary text-muted-foreground'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{truncateTitle(chat.title)}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}