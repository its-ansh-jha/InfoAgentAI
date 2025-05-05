import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = '' }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900 dark:bg-neutral-950 rounded-md my-3 relative">
      {language && (
        <div className="px-4 py-1 text-xs text-neutral-400 border-b border-neutral-800">
          {language}
        </div>
      )}
      <div className="absolute top-2 right-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={copyToClipboard}
          className="h-7 w-7 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-neutral-200 text-sm">{code}</code>
      </pre>
    </div>
  );
}
