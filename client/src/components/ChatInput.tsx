import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import { SendHorizonal, Mic, Globe, ImagePlus, ImageIcon, X } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

export function ChatInput() {
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    
    // Must have either text or an image to submit
    if ((!input.trim() && !imageFile) || isLoading) return;

    // Send the message with optional image
    await sendUserMessage(input, imageFile);
    
    // Reset state
    setInput('');
    setImageFile(null);
    setImageName('');
    
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
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image file is too large (maximum: 5MB)",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      setImageFile(file);
      setImageName(file.name);
      
      toast({
        title: "Image added",
        description: `Image "${file.name}" added to your message`,
        duration: 2000,
      });
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImageName('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
