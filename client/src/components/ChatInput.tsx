import React, { useRef, useState, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/context/ChatContext';
import { autoResizeTextarea } from '@/utils/helpers';

export function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendUserMessage, isLoading } = useChat();

  // Auto-resize textarea on input
  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendUserMessage(input);
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <footer className="sticky bottom-0 border-t border-neutral-800 bg-background dark-glass py-4">
      <div className="container mx-auto px-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-grow relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your message here..."
              className="w-full border border-muted rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-secondary text-foreground resize-none professional-border"
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              <span>Using </span>
              <span className="font-medium text-primary">
                GPT-4o-mini
              </span>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-white p-3 rounded-md transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </footer>
  );
}
