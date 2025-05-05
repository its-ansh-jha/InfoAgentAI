import React, { useState } from 'react';
import { Message } from '@/types';
import { 
  Bot, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  RefreshCw, 
  Volume2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/CodeBlock';
import { MathDisplay } from '@/components/MathDisplay';
import { extractCodeBlocks } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, content } = message;
  const isUser = role === 'user';
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Skip rendering system messages completely
  if (role === 'system') {
    return null;
  }
  
  // Split content into text, code blocks, and math blocks
  const contentParts = extractCodeBlocks(content);

  const copyToClipboard = () => {
    // Only copy text portions, not code blocks
    const textContent = contentParts
      .filter(part => !part.isCode)
      .map(part => part.text)
      .join('\n');
    
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied",
      duration: 2000,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const textToSpeech = () => {
    // Extract only the text content for speech
    const textContent = contentParts
      .filter(part => !part.isCode && !part.isMath && !part.isInlineMath)
      .map(part => part.text)
      .join(' ');
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textContent);
      window.speechSynthesis.speak(utterance);
      
      toast({
        title: "Text-to-Speech",
        description: "Reading message aloud",
        duration: 2000,
      });
    } else {
      toast({
        title: "Error",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const regenerateResponse = () => {
    // This would be hooked up to your chat context to regenerate the response
    toast({
      title: "Regenerating response",
      description: "Please wait while we get a new response",
      duration: 2000,
    });
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    // This would be hooked up to your feedback system
    toast({
      title: `Feedback recorded: ${type === 'like' ? 'Helpful' : 'Not helpful'}`,
      description: "Thank you for your feedback",
      duration: 2000,
    });
  };

  return (
    <div className={`flex items-start ${isUser ? 'justify-end space-x-3' : 'space-x-3'} mb-6`}>
      {!isUser && (
        <div className="bg-primary bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center text-white flex-shrink-0 mt-1 soft-glow">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <div className={`flex flex-col ${isUser 
        ? 'bg-muted rounded-2xl accent-border p-4 max-w-[85%] shadow-md' 
        : 'bg-neutral-950 dark:bg-neutral-950 rounded-2xl p-4 max-w-[85%] shadow-md border border-neutral-800'}`}
      >
        <div className="text-foreground">
          {contentParts.map((part, index) => {
            if (part.isCode) {
              return <CodeBlock key={index} code={part.text} language={part.language} />;
            } else if (part.isMath) {
              return (
                <div key={index} className="my-4 overflow-x-auto">
                  <MathDisplay math={part.text} isBlock={true} />
                </div>
              );
            } else if (part.isInlineMath) {
              return (
                <span key={index} className="inline-block mx-1">
                  <MathDisplay math={part.text} isBlock={false} />
                </span>
              );
            } else {
              return <p key={index} className="whitespace-pre-line">{part.text}</p>;
            }
          })}
        </div>
        
        {!isUser && (
          <div className="flex mt-3 pt-2 border-t border-neutral-800">
            <div className="flex space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleFeedback('like')}
                      className="h-8 w-8 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Helpful</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleFeedback('dislike')}
                      className="h-8 w-8 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Not helpful</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={copyToClipboard}
                      className="h-8 w-8 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={textToSpeech}
                      className="h-8 w-8 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Read aloud</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={regenerateResponse}
                      className="h-8 w-8 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Regenerate response</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center text-muted-foreground flex-shrink-0 mt-1">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
