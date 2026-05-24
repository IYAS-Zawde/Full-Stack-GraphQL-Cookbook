/**
 * @file main.js
 * @description Application Bootstrapper & Controller.
 * 
 * DESIGN PRINCIPLE: CONTROLLER PATTERN / SEPARATION OF LAYER BOUNDARIES
 * This entrypoint is the glue that connects our isolated layers:
 * 1. Orchestrates the API Network Layer (`GraphQLClient` with `itemQueries`) to fetch variables.
 * 2. Drives the Presentation Render Layer (`UIHandler` of DOM states) to render state.
 * 3. Binds events (Form submissions, deletes, click triggers) so they handle actions gracefully.
 * 
 * By writing main.js purely as an orchestrating controller, our underlying business logic (API, DOM) 
 * remain pristine and fully separated, ready for tests and modular swapping.
 */

import { GraphQLClient } from "./api/graphqlClient.js";
import { GET_ITEMS, CREATE_ITEM, DELETE_ITEM } from "./api/itemQueries.js";
import { UIHandler } from "./dom/uiHandler.js";

// Initialize layers (pointing to boilerplate or local standard port of choice)
const gqlClient = new GraphQLClient("http://localhost:4000/graphql");

const ui = new UIHandler({
  listContainer: "items-grid",
  form: "add-recipe-form",
  loadingIndicator: "loading-loader",
  errorDisplay: "global-error-banner",
  emptyState: "empty-list-indicator"
});

/**
 * Orchestrates fetching the items array and updating the list representation.
 */
async function fetchAndRenderItems() {
  ui.showLoading(true);
  try {
    const data = await gqlClient.request(GET_ITEMS);
    ui.renderItems(data.items, handleDeleteItem);
  } catch (error) {
    ui.showError(error.message);
  } finally {
    ui.showLoading(false);
  }
}

/**
 * Handles deletion transactions. Passed as a safe bound delegate callback to rendering.
 * @param {string} id - The unique ID of the target record.
 */
async function handleDeleteItem(id) {
  if (!confirm("Are you sure you want to delete this recipe catalog item?")) {
    return;
  }
  
  ui.showLoading(true);
  try {
    const data = await gqlClient.request(DELETE_ITEM, { id });
    if (data.deleteItem) {
      await fetchAndRenderItems(); // Sync and reload items dynamically
    } else {
      ui.showError("Failed to delete the requested item recipe.");
    }
  } catch (error) {
    ui.showError(error.message);
  } finally {
    ui.showLoading(false);
  }
}

/**
 * Orchestrates creating a new item upon submitting the DOM form.
 * @param {Event} event - Native Form Event stream.
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const payload = ui.getFormData();
  if (!payload.title || !payload.category) {
    ui.showError("Form validation failed: Please enter a Recipe Title and a Category.");
    return;
  }

  ui.showLoading(true);
  try {
    await gqlClient.request(CREATE_ITEM, { input: payload });
    ui.resetForm();
    await fetchAndRenderItems(); // Reload the board
  } catch (error) {
    ui.showError(error.message);
  } finally {
    ui.showLoading(false);
  }
}

/**
 * Safe initializer to bind HTML actions.
 */
function init() {
  // Bind form listener if exists
  const formElement = document.getElementById("add-recipe-form");
  if (formElement) {
    formElement.addEventListener("submit", handleFormSubmit);
  }

  // Load items on initial start
  fetchAndRenderItems();
}

// Ensure the DOM has finished loading before attaching bindings
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
