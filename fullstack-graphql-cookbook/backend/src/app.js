/**
 * @file app.js
 * @description Application entry point bootstrapper.
 * 
 * DESIGN PRINCIPLE: SYSTEM INSTANTIATION & ROUTING ISOLATION
 * In enterprise software, the express pipeline setup (CORS, body-parsing, logs)
 * should be cleanly configured alongside Apollo Server context managers.
 */

import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { serverConfig } from "./config/index.js";
import { schema } from "./graphql/index.js";

async function startServer() {
  const app = express();

  // Instantiate Apollo Server using consolidated type schemas and resolvers
  const server = new ApolloServer({
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
  });

  // Start the Apollo Server instance beforehand
  await server.start();

  // Middleware routing chains
  app.use(express.json());
  
  // Enable safe domain handshake protocols
  app.use(cors({
    origin: [serverConfig.CLIENT_ORIGIN, "http://localhost:3000"],
    credentials: true,
  }));

  // Bind the Apollo endpoint with express middleware parsing
  app.use(
    serverConfig.GRAPHQL_PATH,
    expressMiddleware(server, {
      // Injects express request streams directly into resolver context
      context: async ({ req }) => ({
        token: req.headers.authorization || "",
      }),
    })
  );

  // Health probe validation
  app.get("/health", (req, res) => {
    res.json({ status: "GREEN", timestamp: new Date().toISOString() });
  });

  app.listen(serverConfig.PORT, () => {
    console.log(`🚀 Boilerplate API Server running at http://localhost:${serverConfig.PORT}${serverConfig.GRAPHQL_PATH}`);
  });
}

// Only trigger bootstrap block if loaded directly (prevents integration test double listens)
// Some modifications to make Nodemon compatible with Windows
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  startServer().catch((err) => {
    console.error("Critical: Failed to boot enterprise GraphQL boilerplate:", err);
  });
}



export { startServer };
