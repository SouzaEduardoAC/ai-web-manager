# Web Interface Migration Plan: MCP Orchestrator (Vue 3 + TypeScript)

## 1. Executive Summary

**Objective:** Migrate the legacy monolithic `index.html` into a modular, type-safe **Vue 3 SPA** using Vite. The new architecture will support robust state management, environment-based authentication (Keycloak), and a native WebSocket protocol compatible with the new Golang backend.

**Definition of Done:**
1.  **Modular Frontend:** Functional Vue 3 application with Pinia and Vue Router.
2.  **Auth Toggle:** Capability to enable/disable Keycloak via environment variables.
3.  **Feature Parity:** Chat, Multi-tool Approval Queue, and MCP Registry management fully operational.
4.  **Type Safety:** 100% TypeScript implementation for all API and Socket interactions.

## 2. Current State Analysis

*   **Legacy Code:** A single `index.html` (800+ lines) using Vue 3 CDN, Socket.IO, and Tailwind CDN.
*   **Networking:** Relies on Socket.IO's specific framing; requires migration to standard WebSockets for the Go backend.
*   **Security:** Currently handles API keys via `prompt()`, which is insecure and lacks persistence.
*   **UI Logic:** Complex state machine for tool approvals (sequential approval -> parallel execution) is tightly coupled with DOM logic.

## 3. Strategic Roadmap

### Phase 1: Foundation & Dev Environment
*   **Scaffold:** Initialize `web-interface` with Vite (`vue-ts` template).
*   **Styling:** Install Tailwind CSS with a custom "MCP Dark" theme.
*   **Config:** Implement a centralized configuration utility that reads from `import.meta.env`.

### Phase 2: Environment-Based Authentication
*   **Feature: Auth Toggle**
    *   **Config:** Use `VITE_ENABLE_AUTH` (boolean) in `.env` files.
    *   **Frontend Logic:** If `VITE_ENABLE_AUTH=false`, the app skips the Keycloak bootstrap and injects a "Local Admin" mock user.
    *   **Backend Sync:** Ensure the Go backend middleware is also configurable to skip JWT validation in local development.
*   **Keycloak Integration:** Install `keycloak-js`. Implement a bootstrap plugin that conditionally initializes Keycloak based on the toggle.
*   **Axios Interceptor:** Add logic to include the `Authorization` header ONLY when auth is enabled.

### Phase 3: State Management (Pinia)
*   **Chat Store:**
    *   `messages`: Polymorphic array (`UserMessage`, `AgentMessage`, `ThinkingMessage`, `ApprovalRequest`).
    *   `isThinking`: Boolean flag to disable input during agent processing.
*   **MCP Store:**
    *   `registry`: List of configured MCPs with real-time health status.
    *   `addMcpForm`: Reactive state for the multi-transport configuration form.

### Phase 4: Native WebSocket Migration
*   **Socket Wrapper:** Create a `useWebSocket` composable using the native `WebSocket` API.
*   **Protocol:** Implement a JSON-based protocol matching the Go backend:
    ```typescript
    {
      "type": "message" | "approval" | "ping",
      "payload": object,
      "metadata": { "timestamp": number, "version": "1.0" }
    }
    ```
*   **Reconnection Logic:** Implement exponential backoff for connection drops.

### Phase 5: Component Refactoring
*   **Chat Module:**
    *   `ChatWindow.vue`: Virtual scrolling for long histories.
    *   `ToolApprovalQueue.vue`: Manages the UI for sequential approvals (1 of N).
*   **Management Module:**
    *   `McpHealthDashboard.vue`: Grid of health cards.
    *   `TransportForm.vue`: Dynamic fields for Stdio, HTTP, SSE, and Docker.

## 4. Verification & Testing Plan

### Local (Dev) Mode
1.  Set `VITE_ENABLE_AUTH=false`.
2.  Verify app loads directly without redirecting to Keycloak.
3.  Test MCP addition and chat interaction.

### Production (Auth) Mode
1.  Set `VITE_ENABLE_AUTH=true`.
2.  Verify redirect to Keycloak login on startup.
3.  Check that API calls fail if the token is removed from LocalStorage.

### Feature Testing
*   **Multi-Tool Queue:** Trigger 3 tools simultaneously. Verify UI shows "1 of 3", "2 of 3", etc.
*   **Error Handling:** Simulate a Go backend crash and verify the UI shows a "Disconnected" state with an auto-reconnect countdown.

## 5. Risk Assessment

*   **Security Leakage:** Risk of accidental production deployment with `VITE_ENABLE_AUTH=false`. 
    *   *Mitigation:* Backend MUST enforce auth unless specifically configured via a `DEV_MODE` environment variable.
*   **Protocol Desync:** Mismatch between Go's JSON tags and Vue's TypeScript interfaces.
    *   *Mitigation:* Share a JSON schema or use a code generator for types.
*   **Docker Latency:** Real-time terminal output might lag if the WebSocket buffer isn't handled correctly.
    *   *Mitigation:* Implement throttling for `tool:output` events.
