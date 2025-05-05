import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bot, Brain } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background border-b border-neutral-800 dark-glass">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-primary bg-opacity-20 rounded-md w-12 h-12 flex items-center justify-center text-white soft-glow">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-2xl flex items-center text-foreground">
              InfoAgent <Brain className="h-5 w-5 ml-2 text-primary" />
            </h1>
            <div className="relative">
              <p className="text-sm text-muted-foreground">by Ansh Kumar Jha</p>
              <div className="absolute bottom-0 left-0 w-16 h-[2px] bg-primary opacity-50"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
