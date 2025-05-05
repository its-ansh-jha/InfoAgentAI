import { apiRequest } from '@/lib/queryClient';

export interface SearchResult {
  title: string;
  url: string;
  description?: string;
  source?: string;
}

export async function performSearch(query: string): Promise<SearchResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await apiRequest<{ results: SearchResult[] }>({
      url: `/api/search?query=${encodedQuery}`,
      method: 'GET',
    });
    
    return response.results || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}