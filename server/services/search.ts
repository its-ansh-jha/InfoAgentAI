import axios from 'axios';
import { z } from 'zod';
import { Request, Response } from 'express';

// Define the schema for search results
const searchResultSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  description: z.string().optional(),
  source: z.string().optional()
});

export type SearchResult = z.infer<typeof searchResultSchema>;

// DuckDuckGo search API wrapper
export async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  try {
    // Prepare parameters for the DuckDuckGo API
    const encodedQuery = encodeURIComponent(query);
    const vqd = Math.floor(Math.random() * 1000000000);
    
    // DuckDuckGo API endpoint
    const url = `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&pretty=0&no_html=1&skip_disambig=1&t=InfoAgent`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.data || response.status !== 200) {
      throw new Error('Failed to retrieve search results');
    }

    // Extract and format results
    const results: SearchResult[] = [];
    
    // Process abstract (top result)
    if (response.data.Abstract && response.data.AbstractURL) {
      results.push({
        title: response.data.Heading || 'Top Result',
        url: response.data.AbstractURL,
        description: response.data.Abstract,
        source: 'Abstract'
      });
    }
    
    // Process related topics
    if (response.data.RelatedTopics && Array.isArray(response.data.RelatedTopics)) {
      response.data.RelatedTopics.forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || topic.Text,
            url: topic.FirstURL,
            description: topic.Text,
            source: 'Related'
          });
        }
      });
    }

    // Limit results to avoid overwhelming the user
    return results.slice(0, 5);
  } catch (error) {
    console.error('Search API error:', error);
    return [];
  }
}

// Express route handler for search
export async function handleSearch(req: Request, res: Response) {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  try {
    const results = await searchDuckDuckGo(query);
    res.status(200).json({ results });
  } catch (error) {
    console.error('Search handler error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
}