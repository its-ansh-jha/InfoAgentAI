import React from 'react';
import { MoreVertical, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-neutral-900 border-b border-neutral-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="font-bold text-xl text-white">
            InfoAgent
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800"
          >
            <Pencil className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="text-center pb-1 text-xs text-neutral-500">
        Created by Ansh Kumar Jha
      </div>
    </header>
  );
}
