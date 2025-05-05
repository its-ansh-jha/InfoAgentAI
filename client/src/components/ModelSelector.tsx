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
    <div className="bg-muted border-b border-neutral-800">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-center">
          <span className="text-sm text-muted-foreground mr-3 font-medium">Select Model:</span>
          <div className="relative inline-block w-64">
            <Select value={model} onValueChange={handleModelChange}>
              <SelectTrigger className="w-full bg-secondary border border-input rounded-md shadow-md professional-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-neutral-800">
                <SelectItem value="gpt-4o-mini" className="focus:bg-primary focus:bg-opacity-10">GPT-4o-mini</SelectItem>
                <SelectItem value="deepseek-r1" className="focus:bg-primary focus:bg-opacity-10">DeepSeek R1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
