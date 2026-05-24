/**
 * @file itemQueries.js
 * @description Centralized registry of GraphQL Operations.
 * 
 * DESIGN PRINCIPLE: SEPARATION OF SCHEMATIC CONFIGURATION
 * Keeping query and mutation definitions isolated in simple static template variables:
 * 1. Promotes reuse: The same query can be triggered from multiple component systems.
 * 2. Improves code maintenance: If schema properties change (e.g. changing field 'title' to 'name'),
 *    we only have one single location to update, instead of hunting through multiple UI components.
 * 3. Enables clean code editor extensions and linter integration for static GraphQL verification.
 */

/**
 * Query to request all items
 */
export const GET_ITEMS = `
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
`;

/**
 * Query to request a single item recipe
 */
export const GET_ITEM = `
  query GetItem($id: ID!) {
    item(id: $id) {
      id
      title
      category
      description
      difficulty
      ingredients
      steps
    }
  }
`;

/**
 * Mutation to draft and commit a new item record.
 * Takes a variables payload object of type CreateItemInput.
 */
export const CREATE_ITEM = `
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      title
      category
      description
      difficulty
      ingredients
      steps
    }
  }
`;

/**
 * Mutation to purge an item record.
 */
export const DELETE_ITEM = `
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;
