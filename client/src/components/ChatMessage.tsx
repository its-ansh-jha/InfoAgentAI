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
        <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white flex-shrink-0 mt-1">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <div className={`${isUser 
        ? 'bg-primary bg-opacity-10 dark:bg-primary dark:bg-opacity-10 rounded-2xl rounded-tr-none border border-primary border-opacity-20' 
        : 'bg-white dark:bg-secondary rounded-2xl rounded-tl-none border border-accent border-opacity-20'} 
        p-4 max-w-[85%] shadow-md futuristic-border ${!isUser ? 'cyber-glow' : ''}`}
      >
        <div className="text-neutral-900 dark:text-white">
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
        <div className="bg-neutral-300 dark:bg-neutral-700 rounded-full w-8 h-8 flex items-center justify-center text-neutral-700 dark:text-neutral-200 flex-shrink-0 mt-1">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
