# AI Context: MCP Orchestrator Web Manager

## Project Intent
This project is the frontend command-and-control center for the **MCP (Model Context Protocol) Orchestrator**. Its primary purpose is to provide a user-friendly interface for human-in-the-loop tool approvals, real-time agent communication, and dynamic MCP server registry management.

## Core Domain Logic
1. **Human-in-the-Loop (HITL):** The orchestrator often requires explicit user approval before executing tools. The frontend must handle these requests sequentially, even if the backend processes them in parallel.
2. **MCP Abstraction:** The interface abstracts different transport protocols (Stdio, Docker, HTTP, SSE) into a unified configuration and monitoring view.
3. **Session Persistence:** State is managed via Pinia to ensure that chat history and connection status remain stable during navigation.

## Development Constraints for AI Agents
- **Type Safety:** Always prefer strict TypeScript interfaces for API and WebSocket payloads.
- **Styling:** Adhere to the "MCP Dark" theme defined in `tailwind.config.js`. Use utility classes over custom CSS.
- **Composition API:** Use `<script setup lang="ts">` for all new Vue components.
- **Immutable Contracts:** Public APIs from the Golang backend are fixed. Match the `WsMessage` protocol exactly.

## Integration Points
- **Backend:** Golang-based MCP Orchestrator.
- **WebSocket:** `ws://[host]/ws` for real-time events.
- **REST:** `/api/models/available`, `/api/mcp/health`, `/api/mcp/add`, etc.
- **Auth:** Keycloak OIDC flow.