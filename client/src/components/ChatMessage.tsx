import React from 'react';
import { Message } from '@/types';
import { Bot, User } from 'lucide-react';
import { CodeBlock } from '@/components/CodeBlock';
import { MathDisplay } from '@/components/MathDisplay';
import { extractCodeBlocks } from '@/utils/helpers';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, content } = message;
  const isUser = role === 'user';
  
  // Skip rendering system messages completely
  if (role === 'system') {
    return null;
  }
  
  // Split content into text, code blocks, and math blocks
  const contentParts = extractCodeBlocks(content);

  return (
    <div className={`flex items-start ${isUser ? 'justify-end space-x-3' : 'space-x-3'}`}>
      {!isUser && (
        <div className="bg-primary bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center text-white flex-shrink-0 mt-1 soft-glow">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <div className={`${isUser 
        ? 'bg-muted rounded-lg accent-border p-4 max-w-[85%] shadow-md' 
        : 'bg-secondary rounded-lg p-4 max-w-[85%] shadow-md professional-border'}`}
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
      </div>
      
      {isUser && (
        <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center text-muted-foreground flex-shrink-0 mt-1">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
