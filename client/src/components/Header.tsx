import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bot, Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-secondary border-b border-neutral-300 dark:border-neutral-800 cyber-grid futuristic-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-accent rounded-lg w-12 h-12 flex items-center justify-center text-white cyber-glow">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-bold text-2xl text-gradient flex items-center">
              InfoAgent <Zap className="h-5 w-5 ml-1 text-accent animate-pulse" />
            </h1>
            <div className="relative">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-1">by Ansh Kumar Jha</p>
              <div className="absolute -bottom-1 left-0 w-1/2 h-px bg-accent opacity-70"></div>
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
