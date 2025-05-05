import React, { useRef, useState, useEffect } from 'react';
import { SendHorizonal, Mic, Globe, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/context/ChatContext';
import { autoResizeTextarea } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

export function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendUserMessage, isLoading } = useChat();
  const { toast } = useToast();

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
  
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      toast({
        title: "Voice input",
        description: "Voice input feature coming soon!",
        duration: 2000,
      });
    } else {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  const handleImageUpload = () => {
    toast({
      title: "Image upload",
      description: "Image upload feature coming soon!",
      duration: 2000,
    });
  };

  return (
    <footer className="sticky bottom-0 py-4 bg-neutral-900">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-center bg-neutral-800 rounded-full border border-neutral-700 overflow-hidden">
            <div className="flex items-center pl-3 space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleImageUpload}
                      className="h-9 w-9 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700"
                    >
                      <ImagePlus className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Upload image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask anything..."
              className="flex-1 py-3 px-3 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-white placeholder-neutral-500 min-h-[44px] max-h-[200px]"
              disabled={isLoading}
            />
            
            <div className="flex items-center pr-2 space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleVoiceInput}
                      className="h-9 w-9 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700"
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Voice input</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-1 text-xs text-neutral-500">
            InfoAgent is using GPT-4o-mini to generate human-like text
          </div>
        </form>
      </div>
    </footer>
  );
}
