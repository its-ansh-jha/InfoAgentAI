import { Message } from '@/types';

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function autoResizeTextarea(element: HTMLTextAreaElement): void {
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
}

export const getSystemMessage = (): Message => ({
  role: 'system',
  content: 'You are InfoAgent, a smart assistant created and trained by Ansh Kumar Jha. You are optimized to provide accurate, useful, and thoughtful information using multiple advanced AI models.',
  model: 'gpt-4o-mini',
  timestamp: new Date().toISOString(),
});

export const getWelcomeMessage = (model: string): Message => ({
  role: 'assistant',
  content: `👋 Hello! I'm InfoAgent, your advanced AI assistant built by Ansh Kumar Jha. I can help with Q&A, reasoning, code generation, and productivity tasks. How can I assist you today?`,
  model: 'gpt-4o-mini',
  timestamp: new Date().toISOString(),
});

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function extractCodeBlocks(content: string): { text: string, isCode: boolean, isMath?: boolean, isInlineMath?: boolean, language?: string }[] {
  const codeBlockRegex = /```(?:(\w+)\n)?([\s\S]*?)```/g;
  const blockMathRegex = /\\\[([\s\S]*?)\\\]/g;
  const inlineMathRegex = /\\\(([\s\S]*?)\\\)/g;
  const parts: { text: string, isCode: boolean, isMath?: boolean, isInlineMath?: boolean, language?: string }[] = [];
  
  // First, split by code blocks
  let lastIndex = 0;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      parts.push({
        text: content.substring(lastIndex, match.index),
        isCode: false
      });
    }
    
    // Add the code block
    const language = match[1] || '';
    parts.push({
      text: match[2],
      isCode: true,
      language
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after the last code block
  if (lastIndex < content.length) {
    parts.push({
      text: content.substring(lastIndex),
      isCode: false
    });
  }

  // Now process math blocks in non-code parts
  const result: typeof parts = [];
  
  for (const part of parts) {
    if (part.isCode) {
      result.push(part);
      continue;
    }
    
    // First process block math \[...\]
    const text = part.text;
    let blockMathLastIndex = 0;
    let blockMathParts: typeof parts = [];
    let blockMathMatch;
    
    while ((blockMathMatch = blockMathRegex.exec(text)) !== null) {
      // Add text before the math block
      if (blockMathMatch.index > blockMathLastIndex) {
        blockMathParts.push({
          text: text.substring(blockMathLastIndex, blockMathMatch.index),
          isCode: false,
          isMath: false
        });
      }
      
      // Add the math block
      blockMathParts.push({
        text: blockMathMatch[1],
        isCode: false,
        isMath: true
      });
      
      blockMathLastIndex = blockMathMatch.index + blockMathMatch[0].length;
    }
    
    // Add remaining text after the last block math
    if (blockMathLastIndex < text.length) {
      blockMathParts.push({
        text: text.substring(blockMathLastIndex),
        isCode: false,
        isMath: false
      });
    } else if (blockMathLastIndex === 0) {
      // If no block math was found, keep the original text
      blockMathParts = [part];
    }
    
    // Then process inline math \(...\) in each non-math part from the previous step
    for (const blockMathPart of blockMathParts) {
      if (blockMathPart.isMath) {
        result.push(blockMathPart);
        continue;
      }
      
      const inlineText = blockMathPart.text;
      let inlineMathLastIndex = 0;
      let inlineMathMatch;
      
      while ((inlineMathMatch = inlineMathRegex.exec(inlineText)) !== null) {
        // Add text before the inline math
        if (inlineMathMatch.index > inlineMathLastIndex) {
          result.push({
            text: inlineText.substring(inlineMathLastIndex, inlineMathMatch.index),
            isCode: false,
            isMath: false
          });
        }
        
        // Add the inline math
        result.push({
          text: inlineMathMatch[1],
          isCode: false,
          isInlineMath: true
        });
        
        inlineMathLastIndex = inlineMathMatch.index + inlineMathMatch[0].length;
      }
      
      // Add remaining text after the last inline math
      if (inlineMathLastIndex < inlineText.length) {
        result.push({
          text: inlineText.substring(inlineMathLastIndex),
          isCode: false,
          isMath: false
        });
      } else if (inlineMathLastIndex === 0) {
        // If no inline math was found, add the original part
        result.push(blockMathPart);
      }
    }
  }
  
  return result;
}
