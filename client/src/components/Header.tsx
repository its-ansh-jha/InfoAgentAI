import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bot } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-secondary border-b border-neutral-300 dark:border-secondary-light">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-lg w-10 h-10 flex items-center justify-center text-white">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-secondary dark:text-white">InfoAgent</h1>
            <p className="text-xs text-neutral-400 dark:text-neutral-400">by Ansh Kumar Jha</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
