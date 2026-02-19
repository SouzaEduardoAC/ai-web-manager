# AI Web Manager: MCP Orchestrator UI

The frontend management console for the Model Context Protocol (MCP) Orchestrator. This modular Vue 3 SPA allows users to interact with AI agents, manage MCP server registries, and approve sensitive tool executions.

## 📁 Project Structure

- **`/src`**: The core Vue 3 + TypeScript source code.
- **`/public`**: Static assets.
- **`/docs`**: System documentation and architectural details.
- **`web_interface_migration_plan.md`**: Strategic roadmap used for the legacy-to-modular migration.

## 📖 Documentation

- **[Technical Documentation](./docs/technical_documentation.md)**: Deep dive into the architecture, auth, and protocols.
- **[AI Context](./docs/ai_context.md)**: Essential reading for AI agents or developers new to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MCP Orchestrator Backend (Golang)

### Installation
```bash
npm install
```

### Local Development
```bash
# Set environment variables
cp .env.example .env

# Start the dev server
npm run dev
```

## 🛠 Features
- **Real-time Agent Chat**: Powered by native WebSockets.
- **Multi-Transport Registry**: Support for Stdio, SSE, HTTP, and Docker containers.
- **HITL Approvals**: Sequential queue for human-in-the-loop tool execution.
- **Modular Auth**: Keycloak integration with a local bypass for development.