# MCP Orchestrator Web Interface

Modular Vue 3 + TypeScript frontend for MCP Orchestrator.

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Copy `.env.example` to `.env` and adjust values.
    ```bash
    cp .env.example .env
    ```

3.  **Development:**
    ```bash
    npm run dev
    ```

4.  **Build:**
    ```bash
    npm run build
    ```

## Features

- **Modular Architecture:** Vue 3 SPA with Pinia and Vue Router.
- **Auth Toggle:** Conditional Keycloak integration via `VITE_ENABLE_AUTH`.
- **WebSocket Protocol:** Native WebSocket implementation for high performance.
- **Custom Theme:** "MCP Dark" theme inspired by terminal interfaces.
- **Sequential Tool Approvals:** Enhanced UI for managing multiple tool requests.
- **Health Dashboard:** Real-time monitoring of registered MCP servers.