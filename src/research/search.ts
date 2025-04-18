import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { Exa } from 'exa-js';
import { logger } from '../utils/logger.js';

/**
 * Register the Exa search tool for web research
 */
export function registerExaSearchTool(server: FastMCP): void {
  server.addTool({
    name: 'exa_search',
    description: 'Search the web using Exa API',
    parameters: z.object({
      query: z.string(),
      num_results: z.number().min(1).max(100).default(5),
      type: z.enum(['auto', 'keyword', 'neural']).default('auto'),
      start_published_date: z.string().optional(),
      end_published_date: z.string().optional(),
      include_domains: z.array(z.string()).optional(),
      exclude_domains: z.array(z.string()).optional(),
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
      ]).default('general'),
      live_crawl: z.enum(['always', 'fallback']).default('always')
    }),
    execute: async (params) => {
      // Ensure API key is set
      if (!process.env.EXA_API_KEY) {
        const errorMessage = 'EXA_API_KEY environment variable is not set. Please set it before using this tool.';
        logger.error(errorMessage);
        return JSON.stringify({
          error: errorMessage
        });
      }

      try {
        const exa = new Exa(process.env.EXA_API_KEY);
        logger.info(`Executing Exa search: "${params.query}" (${params.num_results} results)`);
        
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
        
        // Log success
        logger.info(`Exa search complete: found ${results.results.length} results`);
        
        return JSON.stringify(results);
      } catch (error) {
        const errorMessage = `Error executing Exa search: ${error}`;
        logger.error(errorMessage);
        
        return JSON.stringify({
          error: errorMessage
        });
      }
    }
  });

  logger.info('Exa search tool registered');
} 