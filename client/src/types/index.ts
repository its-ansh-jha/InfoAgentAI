export interface Message {
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model: 'gpt-4o-mini';
  timestamp: string;
  loading?: boolean;
}

export type ModelType = 'gpt-4o-mini';

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}
