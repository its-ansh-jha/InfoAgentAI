import React from 'react';
import { Header } from '@/components/Header';
import { ModelSelector } from '@/components/ModelSelector';
import { ChatContainer } from '@/components/ChatContainer';
import { ChatInput } from '@/components/ChatInput';
import { ChatProvider } from '@/context/ChatContext';

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex flex-col min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 transition-colors duration-300">
        <Header />
        <ModelSelector />
        <ChatContainer />
        <ChatInput />
      </div>
    </ChatProvider>
  );
}
