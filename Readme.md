# MCP Think Server

<div align="center">
  <img src="https://github.com/user-attachments/assets/d86470ba-45d4-48d0-8ebe-783c402dd4f4" alt="ContextCraft Logo" width="240">
  <p>The "think" tool excels where other approaches fall short</p>
</div>

[![npm version](https://img.shields.io/npm/v/mcp-think-server.svg)](https://www.npmjs.com/package/mcp-think-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Official implementation of Anthropic's "think" tool as an MCP server** - dramatically improve Claude's reasoning capabilities with structured thinking.

## What is the Think Tool?

The "think" tool provides Claude with a dedicated space for structured reasoning during complex problem-solving tasks. Unlike Anthropic's "extended thinking" capability (which helps Claude plan before generating a response), the "think" tool allows Claude to pause mid-task to process new information obtained from tool calls or user interactions.

According to Anthropic's March 2025 research, this approach enables more thoughtful, accurate, and reliable responses, especially for tasks requiring complex reasoning, policy adherence, and sequential decision-making.

## Performance Benefits (Latest Research)

Recent studies by Anthropic demonstrate remarkable improvements when using the "think" tool:

- **54% relative improvement** in the airline domain (0.570 vs. 0.370 on pass^1 metric)
- **Significantly better performance** in the retail domain (0.812 vs. 0.783 baseline)
- **Enhanced consistency** across multiple trials of the same task
- **Improved performance** on software engineering benchmarks
- **1.6% average improvement** on SWE-Bench, contributing to Claude 3.7 Sonnet's state-of-the-art score of 0.623

The best performance comes from pairing the "think" tool with domain-specific prompting that provides examples of reasoning approaches relevant to the task.

## Key Benefits

The "think" tool excels where other approaches fall short:
- **Better than extended thinking** for cases where Claude doesn't have all necessary information from the initial query
- **More effective than baseline prompting** for policy-heavy scenarios
- **Especially powerful** for analyzing tool outputs from other MCP servers

## Technical Implementation

This MCP server is a lightweight, efficient implementation of Anthropic's "think" tool using the FastMCP library:

- **Minimal footprint**: Just ~32 lines of TypeScript code
- **Simple interface**: Accepts a single parameter for structured reasoning
- **Standards-compliant**: Follows Anthropic's official MCP specifications
- **Zero dependencies** beyond the MCP protocol requirements
- **Cross-platform compatible**: Works with Claude Desktop, Cursor, and other MCP clients

## Installation

### Global Installation
You can install the server globally:

```bash
npm install -g mcp-think-server
```

And then run it from anywhere:

```bash
mcp-think-server
```

### Local Installation
You can also install it locally:

```bash
npm install mcp-think-server
```

And run it via npx:

```bash
npx mcp-think-server
```

### Troubleshooting

If you encounter issues during installation:

1. Make sure you have Node.js version 18 or higher installed
2. If TypeScript compilation fails, you can try:
   ```bash
   git clone https://github.com/flight505/mcp-think-server.git
   cd mcp-think-server
   npm install
   npm run build
   npm link
   ```

## Cursor Integration

When setting up with Cursor, follow these specific steps:

1. **Configure MCP in Cursor's settings**:

   Create or edit your `~/.cursor/mcp.json` file:

   ```json
   {
     "mcpServers": {
       "think-tool": {
         "command": "mcp-think-server",
         "type": "stdio"
       }
     }
   }
   ```

   Alternatively, for a temporary setup:

   ```json
   {
     "mcpServers": {
       "think-tool": {
         "command": "npx",
         "type": "stdio",
         "args": [
           "mcp-think-server"
         ]
       }
     }
   }
   ```

2. **Restart Cursor** after changing configuration.

3. **If using the npx method fails**, try the global installation method or the local installation first to make sure the package is properly built.

4. **Troubleshooting Cursor integration**:
   - Check Cursor's MCP logs for detailed error messages
   - Ensure Node.js v18+ is in your PATH
   - Verify that no other MCP server is using the same name

## How It Works

According to Anthropic's latest research, the "think" tool works through a standard tool specification format:

```json
{
  "name": "think",
  "description": "Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log. Use it when complex reasoning or some cache memory is needed.",
  "input_schema": {
    "type": "object",
    "properties": {
      "thought": {
        "type": "string",
        "description": "A thought to think about."
      }
    },
    "required": ["thought"]
  }
}
```

**Key mechanism:** The tool doesn't perform any external actions or retrieve new information - it simply provides Claude with a dedicated space for structured reasoning. This dramatically improves performance on complex tasks by allowing Claude to:

1. **Pause mid-response** to organize thoughts when new information is received
2. **Create a structured approach** to multi-step problems
3. **Verify policy compliance** more thoroughly and consistently
4. **Carefully analyze outputs** from other MCP tools
5. **Maintain better context awareness** across long interactions

## When to Use the Think Tool

The "think" tool is especially valuable when:

1. **Working with other MCP tools** - Great for analyzing outputs from databases, filesystems, or APIs
2. **Following complex policies** - Perfect for customer service, legal, or compliance scenarios
3. **Making sequential decisions** - Ideal for workflows where later steps depend on earlier ones
4. **Processing web search results** - Helps Claude synthesize information from multiple sources
5. **Solving coding challenges** - Improves success rates on software engineering tasks

## System Prompt for Optimal Results

Anthropic's research shows that **combining the "think" tool with optimized prompting delivers the strongest performance improvements**. For best results, add the following optimized system prompt to your Claude interaction:

### For Claude Desktop (Custom Instructions)

Add this to Settings > Custom Instructions:

```
You have access to a "think" tool that provides a dedicated space for structured reasoning. Using this tool significantly improves your performance on complex tasks.

## When to use the think tool

Before taking any action or responding to the user after receiving tool results, use the think tool as a scratchpad to:
- List the specific rules that apply to the current request
- Check if all required information is collected
- Verify that the planned action complies with all policies
- Iterate over tool results for correctness
- Analyze complex information from web searches or other tools
- Plan multi-step approaches before executing them

## How to use the think tool effectively

When using the think tool:
1. Break down complex problems into clearly defined steps
2. Identify key facts, constraints, and requirements
3. Check for gaps in information and plan how to fill them
4. Evaluate multiple approaches before choosing one
5. Verify your reasoning for logical errors or biases

Remember that using the think tool has been shown to improve your performance by up to 54% on complex tasks, especially when working with multiple tools or following detailed policies.
```

### For Cursor (Global Rules)

Add this to Cursor Settings > General > Rules for AI:

```
After any context change (viewing new files, running commands, or receiving tool outputs), use the "mcp_think" tool to organize your reasoning before responding.

Specifically, always use the think tool when:
- After examining file contents or project structure
- After running terminal commands or analyzing their outputs
- After receiving search results or API responses
- Before making code suggestions or explaining complex concepts
- When transitioning between different parts of a task

When using the think tool:
- List the specific rules or constraints that apply to the current task
- Check if all required information is collected
- Verify that your planned approach is correct
- Break down complex problems into clearly defined steps
- Analyze outputs from other tools thoroughly
- Plan multi-step approaches before executing them

The think tool has been proven to improve performance by up to 54% on complex tasks, especially when working with multiple tools or following detailed policies.
```

## License

[MIT License](LICENSE)
