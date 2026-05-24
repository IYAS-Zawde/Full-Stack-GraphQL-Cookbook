/**
 * @file index.js
 * @description Centralized aggregator for schema definitions and model resolvers.
 * 
 * DESIGN PRINCIPLE: SYSTEM COHESION & AGGREGATION
 * In enterprise-grade applications, the schema is decomposed into a variety of domain areas
 * (e.g. Items, Users, Payments) for ease of engineering. 
 * This file serves as the unified docking port, stitching fragments together as an aggregate.
 */

import { typeDefs } from "./schema/item.typedefs.js";
import { resolvers } from "./resolvers/item.resolvers.js";

// Combine separate arrays for multi-domain support should the codebase extend
export const schema = {
  typeDefs,
  resolvers,
};
