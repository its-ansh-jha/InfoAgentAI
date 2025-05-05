export interface Message {
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model: 'gpt-4o-mini' | 'deepseek-r1';
  timestamp: string;
  loading?: boolean;
}

export type ModelType = 'gpt-4o-mini' | 'deepseek-r1';
