# Full-Stack GraphQL Cookbook Portfolio Boilerplate

An enterprise-grade, clean-architecture template demonstrating extreme **Separation of Concerns (SoC)**, **Data-Access Isolation (DAL)**, and highly decoupleable layers in a full-stack GraphQL ecosystem using Apollo Server 4, Express, and modern vanilla JavaScript client patterns.

---

## 🎨 Architectural Design Philosophy

This repository is designed from the ground up as a production-ready model for developer portfolios. Rather than bundling API routes, database logic, and client layouts into a monolithic tangle, this boilerplate isolates each technical tier into domain-driven responsibilities:

```
                            ┌────────────────────────────────────┐
                            │      Vanilla JavaScript Client     │
                            │  (main.js, HTML, CSS Structure)    │
                            └─────────────────┬──────────────────┘
                                              │ Uses Event Handlers
                            ┌─────────────────▼──────────────────┐
                            │         Presentation Tier          │
                            │      (DOM / uiHandler.js)          │
                            └─────────────────┬──────────────────┘
                                              │ Uses Operations
                            ┌─────────────────▼──────────────────┐
                            │        Network Layer Client        │
                            │ (graphqlClient.js + itemQueries)   │
                            └─────────────────┬──────────────────┘
                                              │ POST GraphQL HTTP Payload
                                              ▼
                            ┌────────────────────────────────────┐
                            │        GraphQL Schema (SDL)        │
                            │       (item.typedefs.js)          │
                            └─────────────────┬──────────────────┘
                                              │ Intercepts & Routes
                            ┌─────────────────▼──────────────────┐
                            │            Resolvers               │
                            │       (item.resolvers.js)          │
                            └─────────────────┬──────────────────┘
                                              │ Thin Delegates Only
                            ┌─────────────────▼──────────────────┐
                            │        Service Layer (DAL)         │
                            │         (item.service.js)          │
                            └─────────────────┬──────────────────┘
                                              │ Direct Data Handling
                                              ▼
                                    [ In-Memory State / DB ]
```

### High-Fidelity Separation Patterns
1. **Resolvers Do Not Touch Arrays/DB**: It is a critical anti-pattern for GraphQL resolvers to execute direct database operations or modify local cache arrays. Relational arrays, queries, and mutations belong exclusively to the **Service Layer (`item.service.js`)**.
2. **Unified Fetch Gateway**: The frontend client wraps native fetch functions inside a dedicated, reusable client class **(`graphqlClient.js`)**. This client globally intercept checks the GraphQL typical `200 OK` responses for internal schema `errors` arrays, exposing meaningful warnings to standard interfaces.
3. **Pristine Visual Renders**: Our rendering engine **(`uiHandler.js`)** operates completely agnostic of networks. It acts as a passive representation layer receiving raw structures, letting you swap out frontend libraries (e.g. React or Vue) in days without editing the communications code.

---

## 📁 Repository Directory Layout

```
fullstack-graphql-cookbook/
├── backend/
│   ├── src/
│   │   ├── config/              # Server configuration, environment variables, CORS setup
│   │   │   └── index.js         # Parses env and isolates configuration lookups
│   │   ├── graphql/             # Core GraphQL layer
│   │   │   ├── schema/          # Schema Definition Language (SDL contracts)
│   │   │   │   └── item.typedefs.js
│   │   │   ├── resolvers/       # Business logic controllers maps
│   │   │   │   └── item.resolvers.js
│   │   │   └── index.js         # Stitching schemas and resolvers together
│   │   ├── services/            # Data Access Layer / Isolated db interface
│   │   │   └── item.service.js  # Pure Javascript handling array state and validations
│   │   └── app.js               # Express API and Apollo Server pipeline bootstrapper
│   ├── package.json             # Service metadata and operational scripts
│   └── .env                     # Local environment parameters
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # Dedicated communication files
│   │   │   ├── graphqlClient.js # Global fetch wrapper enforcing error extractions
│   │   │   └── itemQueries.js   # Isolated raw query string parameters
│   │   ├── dom/                 # Presentation layer
│   │   │   └── uiHandler.js     # Dom manipulation and loading toggles
│   │   └── main.js              # Glue binding networks payloads to views
│   ├── index.html               # Plain dashboard entrypoint
│   └── styles.css               # Clean modern fonts and layout sheets
│
└── README.md                    # Local installation and execution guide
```

---

## 🚀 Execution & Setup Guidelines

### Back-End Service Setup
1. Standardize into the server directory block:
   ```bash
   cd backend
   ```
2. Build dependency libraries:
   ```bash
   npm install
   ```
3. Boot development listeners:
   ```bash
   npm run dev
   ```
   *The server acts on standard development port: `http://localhost:4000/graphql`*

### Front-End Portal Setup
1. Pivot into the client directory:
   ```bash
   cd ../frontend
   ```
2. Because the frontend relies on vanilla module structures, you can serve the plain folder using any local live HTTP listener (Vite, live-server, Nginx, or Python server):
   ```bash
   # Option A: Run via local node setup
   npx live-server .
   
   # Option B: Run python server
   python3 -m http.server 3000
   ```
3. Load in your browser: `http://localhost:3000` to interact with custom recipes!

---

## 🎓 Unit Testing the Decoupled Tiers

Because our code isolates service databases from graphql transport, testing remains extremely clean:

### Testing Data Operations (Service Layer)
```javascript
import { ItemService } from "./src/services/item.service.js";

test("Service creates items with valid schemas", async () => {
  const result = await ItemService.create({ title: "Salt", category: "Cooking" });
  assert.equal(result.title, "Salt");
  assert.exists(result.id);
});
```

### Testing Render Output (UI Handler)
By isolating the viewport inside `uiHandler.js`, you can verify presentation layouts without needing active endpoints:
```javascript
import { UIHandler } from "./src/dom/uiHandler.js";

test("Renders empty states if data is null", () => {
  document.body.innerHTML = '<div id="items-grid"></div><div id="empty-list-indicator" class="hidden"></div>';
  const ui = new UIHandler({ listContainer: "items-grid", emptyState: "empty-list-indicator" });
  ui.renderItems([]);
  assert.notInclude(document.getElementById("empty-list-indicator").classList.contains("hidden"));
});
```
