/**
 * @file index.js
 * @description Centralized server configuration and environment guards.
 * 
 * DESIGN PRINCIPLE: SYSTEM ENVIRONMENT ISOLATION
 * Avoid referencing raw `process.env.VARIABLE_NAME` inline within nested services. 
 * If variables are scattered, moving from dynamic variables to an external parameter store 
 * (like Google Cloud Secret Manager or AWS Systems Manager) forces a full-code search.
 * 
 * Placing env values inside a single configuration entry module guarantees:
 * 1. Type sanitation & default value protection.
 * 2. Rapid testing mocks.
 * 3. A single file to assert server start dependencies.
 */

import dotenv from "dotenv";
import path from "path";

// Load local variables in non-production scenarios
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(process.cwd(), ".env") });
}

export const serverConfig = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  GRAPHQL_PATH: "/graphql"
};
