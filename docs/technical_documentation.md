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
├── src/
│   ├── assets/         # Images, global styles, and fonts
│   ├── components/     # Reusable UI components (Modals, Forms, Chat)
│   ├── composables/    # Shared logic (useWebSocket)
│   ├── stores/         # Pinia state management
│   ├── utils/          # API helpers and centralized config
│   ├── views/          # Route-level components (Chat, Registry)
│   ├── App.vue         # Root layout and global event listeners
│   └── main.ts         # Application entry point
├── public/             # Static assets
├── docs/               # System documentation
├── package.json        # Dependencies and scripts
├── Dockerfile          # Multi-stage build configuration
├── docker-compose.yml  # Container orchestration
├── nginx.conf          # Nginx configuration for SPA routing
└── vite.config.ts      # Vite configuration
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

## Deployment & Containerization
The project is fully containerized using **Docker**:
- **Multi-stage Build:**
  - **Stage 1 (Build):** Uses `node:20-alpine` to install dependencies and build the production-ready `dist` folder.
  - **Stage 2 (Production):** Uses `nginx:stable-alpine` to serve the static assets.
- **SPA Routing:** A custom `nginx.conf` is used to ensure all requests are redirected to `index.html`, allowing Vue Router to handle navigation.
- **Orchestration:** `docker-compose.yml` manages the service, port mappings (`8080:80`), and environment variable injection.

## Asset Management
- **Logo:** The primary branding logo is `src/assets/ecoza_corp_backgroundless.png`.
- **Styling:** Global directives and theme configurations are handled in `src/style.css` and `tailwind.config.js`.
