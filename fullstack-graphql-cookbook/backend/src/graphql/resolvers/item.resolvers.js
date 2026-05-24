/**
 * @file item.resolvers.js
 * @description GraphQL resolver mappings for Queries and Mutations.
 * 
 * DESIGN PRINCIPLE: CONTROLLER-LEVEL DELEGATION
 * Resolvers act as lightweight traffic-routers in Full-Stack API design. 
 * They should be thin:
 * 1. Read input parameters from args/context.
 * 2. Delegate the heavy computations, security checks, and database I/O to the Service Layer (`ItemService`).
 * 3. Return the response shape expected by the Type Definitions.
 * 
 * If code rules such as validations, authorization, or calculations spill into resolvers,
 * they become monolithic and highly complex to reuse across REST endpoints or WebSockets.
 */

import { ItemService } from "../../services/item.service.js";

export const resolvers = {
  Query: {
    /**
     * Resolves the list of all cooking assets.
     */
    items: async () => {
      try {
        return await ItemService.getAll();
      } catch (error) {
        throw new Error(`Failed to retrieve items inside Resolver: ${error.message}`);
      }
    },

    /**
     * Resolves a single cooking recipe.
     */
    item: async (_, { id }) => {
      try {
        const matchingItem = await ItemService.getById(id);
        if (!matchingItem) {
          throw new Error(`Recipe item with ID '${id}' was not found.`);
        }
        return matchingItem;
      } catch (error) {
        throw new Error(`Failed to load element resolved: ${error.message}`);
      }
    }
  },

  Mutation: {
    /**
     * Resolves creation of a cookbook element.
     */
    createItem: async (_, { input }) => {
      try {
        // Validation could also be handled by schema, but double-checked inside service
        return await ItemService.create(input);
      } catch (error) {
        throw new Error(`Operation createItem failed in execution layer: ${error.message}`);
      }
    },

    /**
     * Resolves removal of a cookbook element.
     */
    deleteItem: async (_, { id }) => {
      try {
        return await ItemService.delete(id);
      } catch (error) {
        throw new Error(`Operation deleteItem failed: ${error.message}`);
      }
    }
  }
};
