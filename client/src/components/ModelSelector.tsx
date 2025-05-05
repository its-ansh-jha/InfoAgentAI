import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChat } from '@/context/ChatContext';
import { ModelType } from '@/types';

export function ModelSelector() {
  const { model, setModel } = useChat();

  const handleModelChange = (value: string) => {
    setModel(value as ModelType);
  };

  return (
    <div className="bg-neutral-200 dark:bg-secondary-dark border-b border-neutral-300 dark:border-secondary-light">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <span className="text-sm text-neutral-700 dark:text-neutral-300 mr-2">Select Model:</span>
          <div className="relative inline-block w-64">
            <Select value={model} onValueChange={handleModelChange}>
              <SelectTrigger className="w-full bg-white dark:bg-secondary border border-neutral-300 dark:border-secondary-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
                <SelectItem value="deepseek-r1">DeepSeek R1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
