/**
 * @file item.typedefs.js
 * @description GraphQL Schema Definition Language (SDL) string format.
 * 
 * DESIGN PRINCIPLE: SCHEMA-FIRST GRAPHQL
 * By explicitly setting our contract here, we provide front-end and back-end
 * developers with a unified agreement. Client teams can begin mocking service responses
 * using the generated schema even before the database fields are fully configured.
 * 
 * Scalability Benefits:
 * - Clear modular segmentation: Each domain resource (Item, User, Review) should have its own scale file.
 * - Robust input typings ensures any malformed requests are blocked automatically at the edge before
 *   hitting our business logic calculators.
 */

export const typeDefs = `#graphql
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
`;
