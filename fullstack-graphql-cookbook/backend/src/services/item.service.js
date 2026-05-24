/**
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
  /**
   * Retrieves all items from the database representation.
   * @returns {Promise<Array>} List of all records
   */
  async getAll() {
    // Simulating database network-latency with Promise delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...itemsTable]);
      }, 100);
    });
  },

  /**
   * Retrieves a single item record from the database.
   * @param {string} id - The unique ID of the record
   * @returns {Promise<Object|null>} The item matching the specification
   */
  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = itemsTable.find(it => it.id === id);
        resolve(item ? { ...item } : null);
      }, 50);
    });
  },

  /**
   * Appends a new item to the data array.
   * @param {Object} itemData - Attributes for creation
   * @returns {Promise<Object>} The crafted complete entity
   */
  async create(itemData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!itemData.title || !itemData.category) {
          return reject(new Error("Validation failed: 'title' and 'category' are strict requirements."));
        }

        const newItem = {
          id: `item-${Date.now()}`,
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

  /**
   * Deletes a record from the database structure.
   * @param {string} id - Target identifier
   * @returns {Promise<boolean>} Success confirmation
   */
  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const originalLength = itemsTable.length;
        itemsTable = itemsTable.filter(it => it.id !== id);
        resolve(itemsTable.length < originalLength);
      }, 80);
    });
  }
};
