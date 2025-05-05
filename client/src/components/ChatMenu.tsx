import React, { useState } from 'react';
import { PlusCircle, MessageCircle, Settings, Trash2, Menu, X, Clock, Volume2 } from 'lucide-react';
import { useChatHistory } from '@/context/ChatHistoryContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatTimestamp } from '@/utils/helpers';
import { Chat } from '@/types';

export function ChatMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { chats, currentChatId, startNewChat, loadChat, deleteChat } = useChatHistory();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleStartNewChat = () => {
    startNewChat();
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLoadChat = (chatId: string) => {
    loadChat(chatId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); // Prevent the chat from being selected when deleting
    deleteChat(chatId);
  };

  return (
    <div className="relative z-50">
      {/* Menu Button */}
      <Button
        onClick={toggleMenu}
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 h-10 w-10 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {/* Menu Panel */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 flex"
          onClick={() => isMobile && setIsOpen(false)}
        >
          {/* Overlay for mobile */}
          {isMobile && (
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          )}
          
          {/* Sidebar */}
          <div 
            className="relative h-full w-80 bg-neutral-900 border-r border-neutral-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-4 py-4 border-b border-neutral-800 flex justify-between items-center">
                <h2 className="text-lg font-medium text-white">Conversations</h2>
                <Button
                  onClick={handleStartNewChat}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-neutral-800 text-white"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Chats List */}
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-1">
                  {chats.length === 0 ? (
                    <div className="p-4 text-center text-neutral-500">
                      No conversations yet
                    </div>
                  ) : (
                    chats.map((chat: Chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleLoadChat(chat.id)}
                        className={`flex items-center justify-between group px-3 py-2 rounded-md cursor-pointer ${
                          chat.id === currentChatId
                            ? 'bg-neutral-700 text-white'
                            : 'hover:bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <MessageCircle className="h-5 w-5 flex-shrink-0" />
                          <div className="truncate">
                            <div className="truncate font-medium">{chat.title}</div>
                            <div className="text-xs text-neutral-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimestamp(chat.updatedAt)}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={(e) => handleDeleteChat(e, chat.id)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-700"
                        >
                          <Trash2 className="h-4 w-4 text-neutral-400" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              
              {/* Footer */}
              <div className="p-4 border-t border-neutral-800">
                <div className="text-xs text-neutral-500 text-center">
                  InfoAgent by Ansh Kumar Jha
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}