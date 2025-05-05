import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe, ExternalLink } from 'lucide-react';
import type { SearchResult } from '@/utils/search';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-neutral-700 rounded w-1/3 mb-3"></div>
        <div className="h-3 bg-neutral-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-neutral-700 rounded w-5/6"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  // Show maximum 5 results to avoid cluttering the UI
  const displayResults = results.slice(0, 5);

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3">
      <div className="flex items-center mb-2 text-sm text-neutral-400">
        <Globe className="h-4 w-4 mr-2" />
        <span>Web results for your query</span>
      </div>
      
      <div className="space-y-2">
        {displayResults.map((result, index) => (
          <a 
            key={index}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:bg-neutral-700/30 rounded-md p-2 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-400 mb-1 line-clamp-1">
                  {result.title}
                </h3>
                {result.description && (
                  <p className="text-xs text-neutral-300 line-clamp-2">
                    {result.description}
                  </p>
                )}
                <div className="text-xs text-neutral-500 mt-1 truncate">
                  {result.source || new URL(result.url).hostname}
                </div>
              </div>
              <ExternalLink className="h-3 w-3 text-neutral-500 mt-1 flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}