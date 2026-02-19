# Technical Documentation: MCP Orchestrator Web Interface

## Architecture Overview
The web interface is a modern Single Page Application (SPA) built with **Vue 3** and **TypeScript**, powered by the **Vite** build tool. It replaces the legacy monolithic `index.html` with a modular, maintainable, and type-safe codebase.

### Key Technologies
- **Framework:** Vue 3 (Composition API)
- **State Management:** Pinia (modular stores for Auth, Chat, and MCP Registry)
- **Routing:** Vue Router (Lazy-loading for views)
- **Styling:** Tailwind CSS with a custom "MCP Dark" terminal-inspired theme
- **Networking:** Native WebSocket API + Axios for RESTful requests
- **Auth:** Keycloak JS integration

## Project Structure
```
web-interface/
├── src/
│   ├── components/     # Reusable UI components (Modals, Forms, Chat)
│   ├── composables/    # Shared logic (useWebSocket)
│   ├── stores/         # Pinia state management
│   ├── utils/          # API helpers and centralized config
│   ├── views/          # Route-level components (Chat, Registry)
│   ├── App.vue         # Root layout and global event listeners
│   └── main.ts         # Application entry point
```

## Authentication Strategy
The application supports a dual-mode authentication system controlled by `VITE_ENABLE_AUTH`:
1. **Local Dev Mode (`false`):** Skips Keycloak initialization and injects a mock "Local Admin" user.
2. **Production Mode (`true`):** Initializes `keycloak-js`, requiring a valid JWT from the configured Keycloak server.

## WebSocket Protocol
The app uses a custom JSON-based protocol over native WebSockets:
- **Type-safe Messages:** Defined via `WsMessage` interface in `useWebSocket.ts`.
- **Automatic Reconnection:** Exponential backoff logic handles transient network drops.
- **Shared Instance:** The WebSocket connection is persisted across route changes via a shared composable state.

## Component Modules
### Chat Module
- **ChatWindow.vue:** Handles message display and directive input.
- **ToolApprovalQueue.vue:** A specialized UI for managing sequential tool approvals (1 of N).

### MCP Management
- **McpHealthDashboard.vue:** Real-time health monitoring of connected MCP servers.
- **TransportForm.vue:** Dynamic configuration for Stdio, HTTP, SSE, and Docker-based transports.
