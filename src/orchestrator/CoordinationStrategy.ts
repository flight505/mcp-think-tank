import { IAgent } from '../agents/IAgent.js';

/**
 * Interface for coordination strategies that manage the order and manner
 * in which agents are executed.
 */
export interface CoordinationStrategy {
  /**
   * Determine the next agent to run in the orchestration sequence.
   * 
   * @param agents - Array of available agents
   * @param currentAgentId - ID of the currently active agent (if any)
   * @param outputs - Map of agent IDs to their outputs so far
   * @param isDone - Optional callback function to check if an agent's output indicates completion
   * @returns The next agent to run, or null if orchestration should terminate
   */
  nextAgent(
    agents: IAgent[],
    currentAgentId: string | null,
    outputs: Map<string, string[]>,
    isDone?: (output: string) => boolean
  ): IAgent | null;
  
  /**
   * Combine the outputs from multiple agents into a final result.
   * 
   * @param outputs - Map of agent IDs to their outputs
   * @returns The combined output
   */
  combine(outputs: Map<string, string[]>): string;
  
  /**
   * Check whether the orchestration is complete based on the current state.
   * 
   * @param agents - Array of available agents
   * @param outputs - Map of agent IDs to their outputs so far
   * @returns True if orchestration should be considered complete, false otherwise
   */
  isDone(agents: IAgent[], outputs: Map<string, string[]>): boolean;
}

/**
 * Result of an orchestration run, including the final output
 * and metadata about the run.
 */
export interface OrchestrationResult {
  output: string;
  finalOutput: string;  // Alias for output for clearer naming
  outputs: string[];    // Array of all individual outputs
  agentOutputs: Map<string, string[]>;
  status: 'COMPLETED' | 'HALTED_LIMIT' | 'ERROR';
  steps: number;
  duration: number;
} 