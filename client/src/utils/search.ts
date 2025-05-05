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
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await apiRequest({
      url: `/api/search?query=${encodedQuery}`,
      method: 'GET',
    }) as SearchResponse;
    
    return response.results || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}