import React from 'react';
import { Header } from '@/components/Header';
import { ChatContainer } from '@/components/ChatContainer';
import { ChatInput } from '@/components/ChatInput';
import { ChatMenu } from '@/components/ChatMenu';
import { ChatProvider } from '@/context/ChatContext';

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
        <Header />
        <ChatMenu />
        <ChatContainer />
        <ChatInput />
      </div>
    </ChatProvider>
  );
}
