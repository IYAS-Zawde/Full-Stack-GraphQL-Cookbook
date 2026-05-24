# 🛠️ GraphQL Cookbook: Separation of Concerns & Interactive Sandbox

Welcome to the **Full-Stack GraphQL Cookbook & Educational Sandbox**. This repository serves as an elite developer portfolio blueprint demonstrating clean-architecture principles, **Separation of Concerns (SoC)**, and modular decoupling inside modern web APIs.

Unlike typical monolithic templates, this project contains both a **beautiful interactive visual playground** (the outer learning application) and a **production-ready production skeleton** ready to be uploaded to GitHub or run locally on Windows, macOS, or Linux.

---

## 📂 Repository Layout Map

This repository is structured into two main logical parts:

```text
/                       <-- ROOT DEV ENVIRONMENT (Vite + React Interactive Web Sandbox)
├── fullstack-graphql-cookbook/ <-- STANDALONE PRODUCTION SKELETON
│   ├── backend/        <-- Apollo Server 4 + Express Server
│   │   ├── src/
│   │   │   ├── graphql/  # SDL Schemas & Thin Resolvers
│   │   │   └── services/ # Pure Service Tier (Data Access Layer)
│   │   └── package.json
│   └── frontend/       <-- Vanilla Local Viewport (Tailwind CSS CDN enabled)
│       ├── src/
│       │   ├── api/      # Reusable GraphQL Client & HTTP 200 checks
│       │   └── dom/      # Passive DOM UI layout rendering
│       ├── index.html
│       └── styles.css
│
├── src/                <-- Sandbox Viewer React Logic
├── index.html          <-- Sandbox Viewer Entrypoint
├── server.ts           <-- Sandbox Dev Server 
└── package.json        <-- Root dependencies
```

---

## 🎯 Architectural Philosophy Enforced

The standalone codebase (`fullstack-graphql-cookbook/`) enforces premium enterprise design patterns:
1. **Thin Resolvers**: GraphQL resolvers are purely traffic controllers; they do not manipulate database tables or arrays. All domain rules go into isolated Services (`item.service.js`).
2. **Standard HTTP 200 Trap Handling**: Because GraphQL returns `200 OK` even for core execution failures, our centralized frontend client (`graphqlClient.js`) inspects response payloads and raises client-side events safely before exceptions break user viewports.
3. **Passive UI Decorator**: The frontend DOM driver (`uiHandler.js`) compiles plain arrays without tracking network states. This makes it trivial to rebuild elements in React or Svelte tomorrow without rewriting backend networks code.

---

## ⚡ Quick Start Option A: Running the Interactive Sandbox Dashboard

The **root-level** containing workspace hosts an interactive multi-view guide, live GraphQL server simulation, dynamic code editor tab viewer, and network diagnostics flow monitor.

### System Requirements
* Node.js v18 or higher
* npm or yarn package manager

### 1. Install Workspace Dependencies
Within the repository root directory, run:
```bash
npm install
```

### 2. Launch the Local Dev Server
```bash
npm run dev
```

### 3. Open in Browser
Visit your terminal's reported URL (typically **`http://localhost:3000`**).
* **Network Inspector Panel**: Trigger CRUD mutations in the visual mockup browser to inspect automatic live, colored JSON transaction payload request traces.
* **Code File Explorer**: Browse real-time syntax-highlighted source documents from both frontend and backend directories.
* **Masterclass Tutorial Tab**: Read detailed architectural walk-throughs covering SOLID design patterns, resolvers, and local data persistence.

---

## 🚀 Quick Start Option B: Running the Standalone Codebase (Local Platforms & Windows)

If you are deploying, migrating, or sharing the core codebase on local Windows platforms without running the outer visualization envelope, you can execute the production code directly from `/fullstack-graphql-cookbook`:

### 1. Launch the Backend API Service

Open your terminal, navigate directly inside the backend directory, and boot the server:
```bash
cd fullstack-graphql-cookbook/backend

# Install server packages
npm install

# Start Apollo GraphQL server
npm run dev
```
* The backend boots up on **`http://localhost:4000/graphql`**. You can visit this URL in your web browser to open the official **Apollo Sandbox Explorer Studio** to write raw test requests against your API schema dynamically.

### 2. Serve the Frontend Interface

Because the frontend relies on raw ESM vanilla import statements, web browsers block them from loaded file paths (`file://...`) due to strict CORS security parameters. **To run this correctly, the frontend must be served locally using any HTTP server.**

Open a separate terminal window and run:
```bash
cd fullstack-graphql-cookbook/frontend

# Choose any of these one-line commands to serve the static index.html:

# Option A: Run via local NodeJS package
npx live-server .

# Option B: Run via Python 3
python3 -m http.server 3000

# Option C: If you use VSCode
# Simply right-click on `index.html` and click "Open with Live Server"
```
* **CDN-ready Local Run Compatibility**: The frontend uses `Tailwind CSS Play CDN` injected cleanly inside the HTML header. This resolves offline CSS formatting rules instantly, rendering a beautiful responsive interface locally on Windows out of the box with zero compilation or build hassles!
* Navigate to **`http://localhost:3000`** in your browser to interact with the catalog.


*Compiled as an executive architectural template for modern full-stack web engineering portfolios.*
