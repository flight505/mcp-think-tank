import { FastMCP } from 'fastmcp';
import { registerExaSearchTool } from './search.js';
import { registerExaAnswerTool } from './answer.js';
import { logger } from '../utils/logger.js';

/**
 * Register all research tools
 */
export function registerResearchTools(server: FastMCP): void {
  // Register Exa search tool
  registerExaSearchTool(server);
  
  // Register Exa answer tool
  registerExaAnswerTool(server);
  
  logger.info('All research tools registered');
} 