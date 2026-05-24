import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ItemService } from "./fullstack-graphql-cookbook/backend/src/services/item.service.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Direct Express parser middlewares
  app.use(express.json());

  // -------------------------------------------------------------
  // LIVE GRAPHQL GATEWAY SIMULATING APOLLO SERVER
  // This route handles actual network payloads from our playground and Sandbox!
  // It responds exactly with GraphQL spec formats: { data: ... } or { errors: [...] }
  // -------------------------------------------------------------
  app.post("/api/graphql", async (req, res) => {
    const { query, variables } = req.body;

    if (!query) {
      return res.status(400).json({
        errors: [{ message: "GraphQL Error: No query string provided." }]
      });
    }

    try {
      // Clean query string and normalize for routing
      const normalizedQuery = query.replace(/\s+/g, " ");

      // ROUTE: Query GetItems
      if (normalizedQuery.includes("query GetItems") || normalizedQuery.includes("items {")) {
        const items = await ItemService.getAll();
        return res.json({ data: { items } });
      }

      // ROUTE: Query GetItem
      if (normalizedQuery.includes("query GetItem") || normalizedQuery.includes("item(")) {
        const id = variables?.id || (normalizedQuery.match(/item\(id:\s*"([^"]+)"\)/) || [])[1];
        if (!id) {
          return res.json({
            errors: [{ message: "Variable 'id' is required for query 'item'." }]
          });
        }
        const item = await ItemService.getById(id);
        if (!item) {
          return res.json({
            errors: [{ message: `Recipe item with ID '${id}' was not found.` }]
          });
        }
        return res.json({ data: { item } });
      }

      // ROUTE: Mutation CreateItem
      if (normalizedQuery.includes("mutation CreateItem") || normalizedQuery.includes("createItem(")) {
        const input = variables?.input;
        if (!input || !input.title || !input.category) {
          return res.json({
            errors: [{ message: "Validation failed: 'title' and 'category' are strict requirements inside CreateItemInput." }]
          });
        }
        const newItem = await ItemService.create(input);
        return res.json({ data: { createItem: newItem } });
      }

      // ROUTE: Mutation DeleteItem
      if (normalizedQuery.includes("mutation DeleteItem") || normalizedQuery.includes("deleteItem(")) {
        const id = variables?.id || (normalizedQuery.match(/deleteItem\(id:\s*"([^"]+)"\)/) || [])[1];
        if (!id) {
          return res.json({
            errors: [{ message: "Variable 'id' is required for mutation 'deleteItem'." }]
          });
        }
        const success = await ItemService.delete(id);
        return res.json({ data: { deleteItem: success } });
      }

      // Default routing fallback
      return res.json({
        errors: [{ message: "GraphQL Validation Fault: The requested operation schema is not supported in this sandbox server." }]
      });

    } catch (err: any) {
      return res.json({
        errors: [{ message: err.message || "Internal Server execution exception during query." }]
      });
    }
  });

  // REST health check path
  app.get("/api/health", (req, res) => {
    res.json({ status: "GREEN", timestamp: new Date().toISOString() });
  });

  // Vite middleware for rendering the React client UI in sandbox
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Developer Portal Server successfully bootet at http://localhost:${PORT}`);
  });
}

startServer();
