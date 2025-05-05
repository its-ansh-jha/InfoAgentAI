import React from 'react';
import { Message } from '@/types';
import { Bot, User } from 'lucide-react';
import { CodeBlock } from '@/components/CodeBlock';
import { extractCodeBlocks } from '@/utils/helpers';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, content } = message;
  const isUser = role === 'user';
  const isSystem = content.startsWith('System:');
  
  // Split content into text and code blocks
  const contentParts = extractCodeBlocks(content);

  return (
    <div className={`flex items-start ${isUser ? 'justify-end space-x-3' : 'space-x-3'}`}>
      {!isUser && (
        <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white flex-shrink-0 mt-1">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <div className={`${isUser 
        ? 'bg-primary bg-opacity-10 dark:bg-primary-dark dark:bg-opacity-20 rounded-2xl rounded-tr-none' 
        : 'bg-white dark:bg-secondary rounded-2xl rounded-tl-none'} 
        p-4 max-w-[85%] shadow-sm`}
      >
        {isSystem ? (
          // System message
          <p className="text-neutral-900 dark:text-white">
            <span className="font-semibold">System:</span> You are InfoAgent, a smart assistant created and trained by Ansh Kumar Jha. You are optimized to provide accurate, useful, and thoughtful information using multiple advanced AI models.
          </p>
        ) : (
          // Regular user or assistant message
          <div className="text-neutral-900 dark:text-white">
            {contentParts.map((part, index) => (
              part.isCode ? (
                <CodeBlock key={index} code={part.text} language={part.language} />
              ) : (
                <p key={index} className="whitespace-pre-line">{part.text}</p>
              )
            ))}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="bg-neutral-300 dark:bg-neutral-700 rounded-full w-8 h-8 flex items-center justify-center text-neutral-700 dark:text-neutral-200 flex-shrink-0 mt-1">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
