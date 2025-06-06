import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { Exa } from 'exa-js';

/**
 * Register the Exa search tool for web research
 */
export function registerExaSearchTool(server: FastMCP): void {
  server.addTool({
    name: 'exa_search',
    description: 'Search the web using Exa API',
    parameters: z.object({
      query: z.string().describe("The search query to execute"),
      num_results: z.number().min(1).max(100).default(5).describe("Number of results to return (1-100)"),
      type: z.enum(['auto', 'keyword', 'neural']).default('auto').describe("Search type: auto (default), keyword (exact matching), or neural (semantic search)"),
      start_published_date: z.string().optional().describe("Filter results published after this date (ISO format)"),
      end_published_date: z.string().optional().describe("Filter results published before this date (ISO format)"),
      include_domains: z.array(z.string()).optional().describe("Only include results from these domains"),
      exclude_domains: z.array(z.string()).optional().describe("Exclude results from these domains"),
      category: z.enum([
        'general',
        'company',
        'research paper',
        'news',
        'pdf',
        'github',
        'tweet',
        'personal site',
        'linkedin profile',
        'financial report'
      ]).default('general').describe("Filter results by content category"),
      live_crawl: z.enum(['always', 'fallback']).default('always').describe("When to use live crawling: 'always' or 'fallback' (when cached not available)")
    }),
    execute: async (params, context) => {
      const log = context && context.log ? context.log : { info() {}, error() {}, warn() {}, debug() {} };
      
      try {
        // Only check for API key when actually executing the search
        // This allows tool listing without requiring the API key
        if (!process.env.EXA_API_KEY) {
          return JSON.stringify({
            error: 'EXA_API_KEY environment variable is not set. Please set it in your configuration before using this tool.'
          });
        }

        const exa = new Exa(process.env.EXA_API_KEY);
        
        // Transform parameters to match Exa API
        const searchParams = {
          numResults: params.num_results,
          type: params.type, // This should match the Exa API's expected values
          startPublishedDate: params.start_published_date,
          endPublishedDate: params.end_published_date,
          includeDomains: params.include_domains,
          excludeDomains: params.exclude_domains,
          category: params.category !== 'general' ? params.category : undefined // Only set category if not 'general'
        };
        
        const results = await exa.search(params.query, searchParams);
        
        return JSON.stringify(results);
      } catch (error) {
        const errorMessage = `Error executing Exa search: ${error}`;
        log.error(errorMessage);
        
        return JSON.stringify({
          error: errorMessage
        });
      }
    }
  });
} 