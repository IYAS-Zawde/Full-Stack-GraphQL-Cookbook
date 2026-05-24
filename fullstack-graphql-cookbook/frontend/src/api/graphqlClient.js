/**
 * @file graphqlClient.js
 * @description Centralized, single-responsibility network wrapper for GraphQL requests.
 * 
 * DESIGN PRINCIPLE: UNIFIED NETWORK LAYER
 * In standard REST, HTTP status codes (404, 500, 401) signal failures. 
 * However, GraphQL endpoints typically return 200 OK even if nested resolver execution fails! 
 * Instead of checking `response.ok` alone or running manual parsing blocks inside raw UI forms,
 * this client centralizes:
 * 
 * 1. Outgoing header configuration (Bearer tokens, content-type).
 * 2. Status parsing validation.
 * 3. Deep extraction of the internal GraphQL 'errors' array.
 * 4. Surface-level structural mapping, returning cleanly resolved payload objects `data`.
 */

export class GraphQLClient {
  /**
   * Initializes the client with a target endpoint.
   * @param {string} endpoint - The target URL of the GraphQL server.
   */
  constructor(endpoint = "http://localhost:4000/graphql") {
    this.endpoint = endpoint;
  }

  /**
   * Executes a GraphQL network transaction.
   * @param {string} query - The GraphQL document (query or mutation) to run.
   * @param {Object} [variables] - Query properties for injection.
   * @returns {Promise<Object>} The resolved 'data' portion of the body structure.
   */
  async request(query, variables = {}) {
    let response;
    
    try {
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Inject authorization values stably (e.g. read from storage or dynamic token states)
          "Authorization": localStorage.getItem("gql_auth_token") || ""
        },
        body: JSON.stringify({
          query,
          variables
        })
      });
    } catch (networkError) {
      // Handles client-side offline situations or server offline blockades
      console.error("[GraphQLClient Network Fault]:", networkError);
      throw new Error(`Connection failed: The server at ${this.endpoint} is unreachable.`);
    }

    // Handles standard non-200 edge exceptions (e.g., bad gateway, throttling)
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown Server Crash");
      throw new Error(`HTTP Error Status [${response.status}]: ${errorText}`);
    }

    const json = await response.json();

    /**
     * CRITICAL GRAPHQL ERROR-FLOW HANDLING:
     * Unlike typical APIs, if a GraphQL query fails (e.g., database validation, parsing, unresolved field types),
     * the HTTP response Code will be 200, but the JSON payload will feature an 'errors' array.
     */
    if (json.errors && json.errors.length > 0) {
      const formattedErrors = json.errors.map(err => err.message).join(" | ");
      console.warn("[GraphQLClient Execution Exception]:", json.errors);
      
      const error = new Error(`GraphQL Execution Failure: ${formattedErrors}`);
      error.graphqlErrors = json.errors; // Store raw array for deep schema auditing at form level
      throw error;
    }

    // Return only the data payload, masking network headers
    return json.data;
  }
}
