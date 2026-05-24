/**
 * @file data.ts
 * @description Static storage index for the full repository files code representation.
 */

import { CodeFileContext, FileTreeNode } from "./types";

export const repositoryFiles: Record<string, CodeFileContext> = {
  // SERVICES
  "item.service.js": {
    title: "item.service.js",
    path: "backend/src/services/item.service.js",
    language: "javascript",
    purpose: "Handles database array mutation and entity validation. Acts as the pure, system-agnostic Data Access Layer (DAL). Resolvers invoke operations here exclusively.",
    code: `/**
 * @file item.service.js
 * @description Data Access Layer (DAL) for Item Resources.
 * 
 * DESIGN PRINCIPLE: SEPARATION OF CONCERNS
 * In a professional enterprise architecture, resolvers should NEVER query or manipulate
 * database connections, files, or state arrays directly. That responsibility belongs 
 * strictly to the Service Layer (this file). 
 * 
 * By isolating data-access code here:
 * 1. Resolvers remain lightweight transfer-controllers, focusing only on HTTP/GraphQL routing.
 * 2. We can switch the underlying database (from this mock array to MongoDB, PostgreSQL, Spanner, etc.)
 *    WITHOUT changing a single line of resolver code.
 * 3. We can easily write isolated unit tests for database manipulation without mocking Apollo Server.
 */

// In-memory relational state simulating a database table
let itemsTable = [
  {
    id: "item-1",
    title: "The Ultimate Query Resolver",
    category: "Queries",
    description: "A foundational recipe for resolving read requests cleanly with cursor pagination.",
    difficulty: "Easy",
    ingredients: ["Apollo Server", "GraphQL-JS", "DataLoader"],
    steps: [
      "Define raw item structures in GraphQL type definitions.",
      "Implement a fetch handler inside the service file.",
      "Call the service from the resolver query block."
    ]
  },
  {
    id: "item-2",
    title: "Atomic Mutation Cooker",
    category: "Mutations",
    description: "How to safely update state arrays with strict transaction boundaries and detailed validation.",
    difficulty: "Hard",
    ingredients: ["Apollo Server", "Express Middleware", "Input Validation"],
    steps: [
      "Construct a structured Input format in the GraphQL schema.",
      "Verify authorization headers prior to mutative execution.",
      "Apply state modifications atomically and return the updated entity."
    ]
  },
  {
    id: "item-3",
    title: "Context Injection Sauce",
    category: "Context",
    description: "A standard recipe to inject authorization headers, database pools, and session states per request.",
    difficulty: "Medium",
    ingredients: ["Express Context", "JWT Token Verification", "CORs Filter"],
    steps: [
      "Extract the Bearer token from incoming request headers.",
      "Validate user verification keys server-side.",
      "Return context payload to make it accessible to all downstream resolvers."
    ]
  }
];

export const ItemService = {
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...itemsTable]), 100);
    });
  },

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = itemsTable.find(it => it.id === id);
        resolve(item ? { ...item } : null);
      }, 50);
    });
  },

  async create(itemData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!itemData.title || !itemData.category) {
          return reject(new Error("Validation failed: 'title' and 'category' are strict requirements."));
        }

        const newItem = {
          id: \`item-\${Date.now()}\`,
          title: itemData.title,
          category: itemData.category,
          description: itemData.description || "A custom crafted GraphQL masterpiece.",
          difficulty: itemData.difficulty || "Medium",
          ingredients: Array.isArray(itemData.ingredients) ? itemData.ingredients : [],
          steps: Array.isArray(itemData.steps) ? itemData.steps : []
        };

        itemsTable.push(newItem);
        resolve({ ...newItem });
      }, 120);
    });
  },

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const originalLength = itemsTable.length;
        itemsTable = itemsTable.filter(it => it.id !== id);
        resolve(itemsTable.length < originalLength);
      }, 80);
    });
  }
};`
  },

  // TYPEDEFS
  "item.typedefs.js": {
    title: "item.typedefs.js",
    path: "backend/src/graphql/schema/item.typedefs.js",
    language: "graphql",
    purpose: "Defines the typed contractual agreements and model structures between Client and Back-End, ensuring request validation happens automatically before logic execution.",
    code: `/**
 * @file item.typedefs.js
 * @description GraphQL Schema Definition Language (SDL) string format.
 * 
 * DESIGN PRINCIPLE: SCHEMA-FIRST GRAPHQL
 * By explicitly setting our contract here, we provide front-end and back-end
 * developers with a unified agreement. Client teams can begin mocking service responses
 * using the generated schema even before the database fields are fully configured.
 */

export const typeDefs = \`#graphql
  enum ThemeDifficulty {
    Easy
    Medium
    Hard
  }

  type Item {
    id: ID!
    title: String!
    category: String!
    description: String!
    difficulty: ThemeDifficulty!
    ingredients: [String!]!
    steps: [String!]!
  }

  input CreateItemInput {
    title: String!
    category: String!
    description: String
    difficulty: ThemeDifficulty
    ingredients: [String!]
    steps: [String!]
  }

  type Query {
    items: [Item!]!
    item(id: ID!): Item
  }

  type Mutation {
    createItem(input: CreateItemInput!): Item!
    deleteItem(id: ID!): Boolean!
  }
\`;`
  },

  // RESOLVERS
  "item.resolvers.js": {
    title: "item.resolvers.js",
    path: "backend/src/graphql/resolvers/item.resolvers.js",
    language: "javascript",
    purpose: "Acts as lightweight routing controllers. Implements the resolver mapping queries/mutations to core backend business processes via ItemService.",
    code: `/**
 * @file item.resolvers.js
 * @description GraphQL resolver mappings for Queries and Mutations.
 * 
 * DESIGN PRINCIPLE: CONTROLLER-LEVEL DELEGATION
 * Resolvers act as lightweight traffic-routers in Full-Stack API design. 
 * They read arguments, perform authorization validations, and immediately
 * delegate the heavy Lifting to the Data Access Layer / Service Layer.
 */

import { ItemService } from "../../services/item.service.js";

export const resolvers = {
  Query: {
    items: async () => {
      try {
        return await ItemService.getAll();
      } catch (error) {
        throw new Error(\`Failed to retrieve items inside Resolver: \${error.message}\`);
      }
    },

    item: async (_, { id }) => {
      try {
        const matchingItem = await ItemService.getById(id);
        if (!matchingItem) {
          throw new Error(\`Recipe item with ID '\${id}' was not found.\`);
        }
        return matchingItem;
      } catch (error) {
        throw new Error(\`Failed to load element resolved: \${error.message}\`);
      }
    }
  },

  Mutation: {
    createItem: async (_, { input }) => {
      try {
        return await ItemService.create(input);
      } catch (error) {
        throw new Error(\`Operation createItem failed in execution layer: \${error.message}\`);
      }
    },

    deleteItem: async (_, { id }) => {
      try {
        return await ItemService.delete(id);
      } catch (error) {
        throw new Error(\`Operation deleteItem failed: \${error.message}\`);
      }
    }
  }
};`
  },

  // GRAPHQL INDEX
  "graphql-index.js": {
    title: "index.js (GraphQL aggregation)",
    path: "backend/src/graphql/index.js",
    language: "javascript",
    purpose: "Consolidation gateway. Merges schema contracts/resolvers representing domain parts cleanly, preparing them for server activation.",
    code: `/**
 * @file index.js
 * @description Centralized aggregator for schema definitions and model resolvers.
 */

import { typeDefs } from "./schema/item.typedefs.js";
import { resolvers } from "./resolvers/item.resolvers.js";

export const schema = {
  typeDefs,
  resolvers,
};`
  },

  // CONFIG
  "config.js": {
    title: "index.js (Config)",
    path: "backend/src/config/index.js",
    language: "javascript",
    purpose: "Captures environment variables, performs cast types sanitations, and exposes central options to guard the code against scattered 'process.env' imports.",
    code: `/**
 * @file index.js
 * @description Centralized server configuration and environment guards.
 * 
 * DESIGN PRINCIPLE: SYSTEM ENVIRONMENT ISOLATION
 * SCattering raw dotenv variables around files increases security risk and testing drag.
 * Grouping variables centrally provides type checks and rapid mocks.
 */

import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(process.cwd(), ".env") });
}

export const serverConfig = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  GRAPHQL_PATH: "/graphql"
};`
  },

  // APP SERVER
  "app.js": {
    title: "app.js",
    path: "backend/src/app.js",
    language: "javascript",
    purpose: "Server bootstrapper. Instantiates standalone API configurations alongside Apollo Server instance and registers global middlewares (CORS checks, body-parsers).",
    code: `/**
 * @file app.js
 * @description Application entry point bootstrapper.
 * 
 * Spawning Apollo Server on top of raw Node/Express pipelines cleanly.
 */

import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { serverConfig } from "./config/index.js";
import { schema } from "./graphql/index.js";

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
  });

  await server.start();

  app.use(express.json());
  app.use(cors({ origin: [serverConfig.CLIENT_ORIGIN], credentials: true }));

  app.use(
    serverConfig.GRAPHQL_PATH,
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.authorization || "",
      }),
    })
  );

  app.listen(serverConfig.PORT, () => {
    console.log(\`🚀 Server running at http://localhost:\${serverConfig.PORT}\`);
  });
}

startServer();`
  },

  // BACKEND PACKAGE
  "backend-pkg.json": {
    title: "package.json (Backend)",
    path: "backend/package.json",
    language: "json",
    purpose: "NPM config specifying modules dependencies (@apollo/server, cors, dotenv) and task shortcuts.",
    code: `{
  "name": "fullstack-graphql-cookbook-backend",
  "version": "1.0.0",
  "description": "Backend API layer for Full-Stack GraphQL Cookbook",
  "main": "src/app.js",
  "type": "module",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "@apollo/server": "^4.10.0",
    "cors": "^2.8.5",
    "dotenv": "^17.0.0",
    "express": "^4.18.2",
    "graphql": "^16.8.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}`
  },

  // BACKEND ENV
  "backend.env": {
    title: ".env (Backend)",
    path: "backend/.env",
    language: "shell",
    purpose: "Declares server options representing safe database environment strings.",
    code: `PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000`
  },

  // GRAPHQL CLIENT
  "graphqlClient.js": {
    title: "graphqlClient.js",
    path: "frontend/src/api/graphqlClient.js",
    language: "javascript",
    purpose: "Custom fetch wrapper. Standardizes JSON-POST payloads, binds authorization headers, and handles the retrieval of nested GraphQL 'errors' arrays globally.",
    code: `/**
 * @file graphqlClient.js
 * @description Centralized, single-responsibility network wrapper for GraphQL requests.
 * 
 * Ensures non-200 and internal GraphQL errors are normalized and throw true error conditions.
 */

export class GraphQLClient {
  constructor(endpoint = "http://localhost:4000/graphql") {
    this.endpoint = endpoint;
  }

  async request(query, variables = {}) {
    let response;
    try {
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("gql_auth_token") || ""
        },
        body: JSON.stringify({ query, variables })
      });
    } catch (networkError) {
      throw new Error(\`Connection failed: The server at \${this.endpoint} is unreachable.\`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(\`HTTP Error Status [\${response.status}]: \${errorText}\`);
    }

    const json = await response.json();

    if (json.errors && json.errors.length > 0) {
      const formattedErrors = json.errors.map(err => err.message).join(" | ");
      const error = new Error(\`GraphQL Execution Failure: \${formattedErrors}\`);
      error.graphqlErrors = json.errors;
      throw error;
    }

    return json.data;
  }
}`
  },

  // ITEM QUERIES
  "itemQueries.js": {
    title: "itemQueries.js",
    path: "frontend/src/api/itemQueries.js",
    language: "javascript",
    purpose: "Pure template operation strings config. Deconstructs operations from component modules for maintainability.",
    code: `/**
 * @file itemQueries.js
 * @description Centralized registry of GraphQL Operations.
 */

export const GET_ITEMS = \`
  query GetItems {
    items {
      id
      title
      category
      description
      difficulty
      ingredients
      steps
    }
  }
\`;

export const CREATE_ITEM = \`
  mutation CreateItem(\$input: CreateItemInput!) {
    createItem(input: \$input) {
      id
      title
      category
      description
      difficulty
      ingredients
      steps
    }
  }
\`;

export const DELETE_ITEM = \`
  mutation DeleteItem(\$id: ID!) {
    deleteItem(id: \$id)
  }
\`;`
  },

  // UI HANDLER
  "uiHandler.js": {
    title: "uiHandler.js",
    path: "frontend/src/dom/uiHandler.js",
    language: "javascript",
    purpose: "DOM manager. Interacts strictly with presentation nodes, binding lists, managing input forms, loading spinners and alerts, independent of query channels.",
    code: `/**
 * @file uiHandler.js
 * @description Single-Responsibility UI and DOM Manipulation Controller.
 * 
 * Binds lists and resets values perfectly. Purely layout/drawing operations.
 */

export class UIHandler {
  constructor(selectors) {
    this.nodes = {
      listContainer: document.getElementById(selectors.listContainer),
      form: document.getElementById(selectors.form),
      loadingIndicator: document.getElementById(selectors.loadingIndicator),
      errorDisplay: document.getElementById(selectors.errorDisplay),
      emptyState: document.getElementById(selectors.emptyState)
    };
  }

  showLoading(isLoading) {
    if (this.nodes.loadingIndicator) {
      if (isLoading) {
        this.nodes.loadingIndicator.classList.remove("hidden");
        this.showError(null);
      } else {
        this.nodes.loadingIndicator.classList.add("hidden");
      }
    }
  }

  showError(err) {
    if (this.nodes.errorDisplay) {
      if (err) {
        this.nodes.errorDisplay.textContent = err;
        this.nodes.errorDisplay.classList.remove("hidden");
      } else {
        this.nodes.errorDisplay.classList.add("hidden");
      }
    }
  }

  renderItems(items, onDelete) {
    const container = this.nodes.listContainer;
    if (!container) return;
    container.innerHTML = "";

    if (this.nodes.emptyState) {
      if (!items || items.length === 0) {
        this.nodes.emptyState.classList.remove("hidden");
        return;
      } else {
        this.nodes.emptyState.classList.add("hidden");
      }
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "bg-white p-6 rounded-lg border border-slate-200 shadow-sm transition-all";
      card.innerHTML = \`
        <div class="flex justify-between items-start gap-2 mb-2">
          <span class="text-xs font-bold text-indigo-600 uppercase">\${item.category}</span>
          <span class="text-xs border px-2 py-0.5 rounded-full font-medium">\${item.difficulty}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">\${item.title}</h3>
        <p class="text-slate-600 text-sm mb-4">\${item.description}</p>
        <button id="btn-delete-\${item.id}" class="text-xs text-rose-600 font-semibold hover:underline">Trash Recipe</button>
      \`;
      container.appendChild(card);

      const delBtn = card.querySelector(\`#btn-delete-\${item.id}\`);
      if (delBtn && onDelete) {
        delBtn.addEventListener("click", () => onDelete(item.id));
      }
    });
  }

  resetForm() {
    if (this.nodes.form) this.nodes.form.reset();
  }
}`
  },

  // FRONTEND MAIN
  "frontend-main.js": {
    title: "main.js (Frontend)",
    path: "frontend/src/main.js",
    language: "javascript",
    purpose: "Integrator Controller. Directs application orchestration, binding uiHandler forms submissions to core graphqlClient.js query routines.",
    code: `/**
 * @file main.js
 * @description Orchestrates client data flow and events.
 */

import { GraphQLClient } from "./api/graphqlClient.js";
import { GET_ITEMS, CREATE_ITEM, DELETE_ITEM } from "./api/itemQueries.js";
import { UIHandler } from "./dom/uiHandler.js";

const client = new GraphQLClient("/api/graphql");
const ui = new UIHandler({
  listContainer: "items-grid",
  form: "add-recipe-form",
  loadingIndicator: "loading-loader",
  errorDisplay: "global-error-banner"
});

async function refresh() {
  ui.showLoading(true);
  try {
    const data = await client.request(GET_ITEMS);
    ui.renderItems(data.items, handleDelete);
  } catch (err) {
    ui.showError(err.message);
  } finally {
    ui.showLoading(false);
  }
}

async function handleDelete(id) {
  if (confirm("Delete recipe?")) {
    ui.showLoading(true);
    try {
      await client.request(DELETE_ITEM, { id });
      refresh();
    } catch (err) {
      ui.showError(err.message);
    }
  }
}

document.getElementById("add-recipe-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  // ... reads payload and calls CREATE_ITEM then refresh ...
});`
  },

  // FRONTEND HTML
  "frontend-index.html": {
    title: "index.html (Frontend)",
    path: "frontend/index.html",
    language: "html",
    purpose: "HTML presentation structure holding the forms inputs and loading grids layouts.",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GraphQL Cookbook Sandbox</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-slate-50 p-8">
  <div id="loading-loader" class="hidden">Synergizing Server...</div>
  <div id="global-error-banner" class="hidden"></div>
  <form id="add-recipe-form">
    <!-- inputs go here -->
  </form>
  <div id="items-grid"></div>
  <script type="module" src="src/main.js"></script>
</body>
</html>`
  },

  // README
  "readme": {
    title: "README.md",
    path: "README.md",
    language: "markdown",
    purpose: "Comprehensive local instructions and project structural walkthrough.",
    code: `# Full-Stack GraphQL Cookbook Portfolio Boilerplate\n\nDetailed walkthrough of Separation of concerns.\nSee file explorer inside this sandbox for details.`
  },

  // TUTORIAL
  "tutorial": {
    title: "TUTORIAL.md",
    path: "TUTORIAL.md",
    language: "markdown",
    purpose: "Senior Architect tutorial discussing Clean Code, Solid, schema-first design, data isolation patterns.",
    code: `# Masterclass Walkthrough: Decoupled GraphQL\n\nDetailed breakdown of DAL layer services and errors.`
  }
};

// Tree structure representing folders
export const repositoryTree: FileTreeNode[] = [
  {
    name: "backend",
    type: "directory",
    path: "backend",
    children: [
      {
        name: "src",
        type: "directory",
        path: "backend/src",
        children: [
          {
            name: "config",
            type: "directory",
            path: "backend/src/config",
            children: [
              { name: "index.js", type: "file", path: "backend/src/config/index.js", contentKey: "config.js" }
            ]
          },
          {
            name: "graphql",
            type: "directory",
            path: "backend/src/graphql",
            children: [
              {
                name: "schema",
                type: "directory",
                path: "backend/src/graphql/schema",
                children: [
                  { name: "item.typedefs.js", type: "file", path: "backend/src/graphql/schema/item.typedefs.js", contentKey: "item.typedefs.js" }
                ]
              },
              {
                name: "resolvers",
                type: "directory",
                path: "backend/src/graphql/resolvers",
                children: [
                  { name: "item.resolvers.js", type: "file", path: "backend/src/graphql/resolvers/item.resolvers.js", contentKey: "item.resolvers.js" }
                ]
              },
              { name: "index.js", type: "file", path: "backend/src/graphql/index.js", contentKey: "graphql-index.js" }
            ]
          },
          {
            name: "services",
            type: "directory",
            path: "backend/src/services",
            children: [
              { name: "item.service.js", type: "file", path: "backend/src/services/item.service.js", contentKey: "item.service.js" }
            ]
          },
          { name: "app.js", type: "file", path: "backend/src/app.js", contentKey: "app.js" }
        ]
      },
      { name: "package.json", type: "file", path: "backend/package.json", contentKey: "backend-pkg.json" },
      { name: ".env", type: "file", path: "backend/.env", contentKey: "backend.env" }
    ]
  },
  {
    name: "frontend",
    type: "directory",
    path: "frontend",
    children: [
      {
        name: "src",
        type: "directory",
        path: "frontend/src",
        children: [
          {
            name: "api",
            type: "directory",
            path: "frontend/src/api",
            children: [
              { name: "graphqlClient.js", type: "file", path: "frontend/src/api/graphqlClient.js", contentKey: "graphqlClient.js" },
              { name: "itemQueries.js", type: "file", path: "frontend/src/api/itemQueries.js", contentKey: "itemQueries.js" }
            ]
          },
          {
            name: "dom",
            type: "directory",
            path: "frontend/src/dom",
            children: [
              { name: "uiHandler.js", type: "file", path: "frontend/src/dom/uiHandler.js", contentKey: "uiHandler.js" }
            ]
          },
          { name: "main.js", type: "file", path: "frontend/src/main.js", contentKey: "frontend-main.js" }
        ]
      },
      { name: "index.html", type: "file", path: "frontend/index.html", contentKey: "frontend-index.html" },
      { name: "styles.css", type: "file", path: "frontend/styles.css", contentKey: "styles.css" }
    ]
  },
  { name: "README.md", type: "file", path: "README.md", contentKey: "readme" },
  { name: "TUTORIAL.md", type: "file", path: "TUTORIAL.md", contentKey: "tutorial" }
];
