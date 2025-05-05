import { Request, Response } from 'express';
import axios from 'axios';
import { z } from 'zod';

// Define a schema for search results
export const searchResultSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  description: z.string().optional(),
  source: z.string().optional(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

/**
 * Search DuckDuckGo for results
 * This uses the DuckDuckGo API which doesn't require an API key
 */
export async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  try {
    // Use DuckDuckGo API through viaduct.duckduckgo.com
    // This allows us to get search results without requiring an API key
    const url = `https://duckduckgo.com/`;
    
    // First, get the vqd parameter which is required for the API
    const initialResponse = await axios.get(url, {
      params: { q: query },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      }
    });
    
    // Extract the vqd parameter from the response
    const vqdMatch = initialResponse.data.match(/vqd=["']([^"']+)['"]/);
    const vqd = vqdMatch ? vqdMatch[1] : '';
    
    if (!vqd) {
      throw new Error('Could not extract vqd parameter');
    }
    
    // Now make the actual search request
    const apiUrl = 'https://links.duckduckgo.com/d.js';
    const searchResponse = await axios.get(apiUrl, {
      params: {
        q: query,
        kl: 'wt-wt', // Worldwide results in English
        dl: 'en', // Language
        o: 'json', // Output format
        vqd: vqd,
        p: 1, // Safe search off
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        'Referer': 'https://duckduckgo.com/',
      }
    });
    
    // Parse the response data which is in a special format
    // DuckDuckGo returns a JavaScript object that is not valid JSON
    // It starts with 'ddg_spice_light.web(' and ends with ')'
    let responseData;
    try {
      const cleanedData = searchResponse.data
        .replace(/^ddg_spice_light\.web\(/, '')
        .replace(/\);$/, '');
      responseData = JSON.parse(cleanedData);
    } catch (error) {
      console.error('Failed to parse DuckDuckGo response:', error);
      // Fallback to simple results
      return [
        {
          title: 'Error parsing search results',
          url: 'https://duckduckgo.com/?q=' + encodeURIComponent(query),
          description: 'Try searching directly on DuckDuckGo'
        }
      ];
    }
    
    // Extract and format the search results
    const results: SearchResult[] = [];
    
    if (responseData && responseData.results) {
      responseData.results.forEach((result: any) => {
        results.push({
          title: result.t || 'No title',
          url: result.u || '#',
          description: result.a || '',
          source: result.i || new URL(result.u).hostname,
        });
      });
    }
    
    return results;
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    // Return a fallback result that directs to DuckDuckGo
    return [
      {
        title: 'Search for "' + query + '" on DuckDuckGo',
        url: 'https://duckduckgo.com/?q=' + encodeURIComponent(query),
        description: 'Click to search directly on DuckDuckGo'
      }
    ];
  }
}

// Fallback to a simpler approach if needed
export async function searchDuckDuckGoSimple(query: string): Promise<SearchResult[]> {
  try {
    // Construct a search URL for DuckDuckGo
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&no_redirect=1&skip_disambig=1`;
    
    // Make the request
    const response = await axios.get(searchUrl);
    const data = response.data;
    
    const results: SearchResult[] = [];
    
    // Extract abstract (main result)
    if (data.Abstract) {
      results.push({
        title: data.Heading || 'DuckDuckGo Result',
        url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        description: data.Abstract,
        source: 'DuckDuckGo Abstract'
      });
    }
    
    // Extract related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || 'Related Topic',
            url: topic.FirstURL,
            description: topic.Text,
            source: 'DuckDuckGo Related'
          });
        }
      });
    }
    
    return results;
  } catch (error) {
    console.error('DuckDuckGo simple search error:', error);
    // Return a fallback result that directs to DuckDuckGo
    return [
      {
        title: 'Search for "' + query + '" on DuckDuckGo',
        url: 'https://duckduckgo.com/?q=' + encodeURIComponent(query),
        description: 'Click to search directly on DuckDuckGo'
      }
    ];
  }
}

/**
 * Handle search requests from the client
 */
export async function handleSearch(req: Request, res: Response) {
  const query = req.query.query as string;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      error: 'Invalid query parameter',
      results: []
    });
  }
  
  try {
    // Try the main search method first
    let results = await searchDuckDuckGo(query);
    
    // If no results, try the simple fallback
    if (results.length === 0) {
      results = await searchDuckDuckGoSimple(query);
    }
    
    return res.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      error: 'Failed to perform search',
      results: []
    });
  }
}