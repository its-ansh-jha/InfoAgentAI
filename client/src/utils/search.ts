import { apiRequest } from '@/lib/queryClient';

export interface SearchResult {
  title: string;
  url: string;
  description?: string;
  source?: string;
}

interface SearchResponse {
  results: SearchResult[];
}

export async function performSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 3) {
    return [];
  }
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await apiRequest<SearchResponse>({
      url: `/api/search?query=${encodedQuery}`,
      method: 'GET',
    });
    
    if (!response || !response.results) {
      return [];
    }
    
    return response.results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}