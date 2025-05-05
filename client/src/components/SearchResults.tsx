import React from 'react';
import { SearchResult } from '@/utils/search';
import { ExternalLink } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="mt-4 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
        <div className="flex items-center space-x-4">
          <div className="w-full space-y-3">
            <div className="h-4 bg-neutral-800 rounded animate-pulse"></div>
            <div className="h-3 bg-neutral-800 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-neutral-800 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <div className="w-full space-y-3">
            <div className="h-4 bg-neutral-800 rounded animate-pulse"></div>
            <div className="h-3 bg-neutral-800 rounded animate-pulse w-5/6"></div>
            <div className="h-3 bg-neutral-800 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
      <h3 className="text-sm font-medium text-white mb-2">Search Results</h3>
      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="pb-3 border-b border-neutral-800 last:border-0">
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start group"
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="text-blue-400 group-hover:underline text-sm font-medium line-clamp-1">
                    {result.title}
                  </h4>
                  <ExternalLink className="h-3 w-3 ml-1 text-neutral-400 flex-shrink-0" />
                </div>
                <p className="text-xs text-neutral-400 line-clamp-1">{result.url}</p>
                {result.description && (
                  <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                    {result.description}
                  </p>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}