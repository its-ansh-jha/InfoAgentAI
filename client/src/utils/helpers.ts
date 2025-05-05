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
  content: `👋 Hello! I'm InfoAgent, your advanced AI assistant built by Ansh Kumar Jha. I can help with Q&A, reasoning, code generation, and productivity tasks. You're currently using ${model}. How can I assist you today?`,
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

export function extractCodeBlocks(content: string): { text: string, isCode: boolean }[] {
  const codeBlockRegex = /```(?:(\w+)\n)?([\s\S]*?)```/g;
  const parts: { text: string, isCode: boolean, language?: string }[] = [];
  
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
  
  return parts;
}
