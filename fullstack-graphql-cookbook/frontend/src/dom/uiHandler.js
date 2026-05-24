/**
 * @file uiHandler.js
 * @description Single-Responsibility UI and DOM Manipulation Controller.
 * 
 * DESIGN PRINCIPLE: SEPARATION OF RENDERING & TRANSPORT
 * In professional vanilla JavaScript architectures, the rendering code must not know 
 * about fetch requests, server latency, or network protocols. 
 * This class takes raw state inputs—loading status, errors, or data objects—and 
 * updates DOM trees accordingly.
 * 
 * Benefits:
 * 1. Testability: We can test these rendering states instantly by feeding mock arrays,
 *    independent of whether HTTP or GraphQL servers are active.
 * 2. Maintainability: If we switch the UI framework (e.g., to React, Svelte, or Web Components),
 *    the API client remains 100% untouched while we replace this presentation handler.
 */

export class UIHandler {
  /**
   * Instantiates UIHandler with native HTML selectors.
   * @param {Object} selectors - Dict mapping keys to DOM selector strings.
   */
  constructor(selectors) {
    this.nodes = {
      listContainer: document.getElementById(selectors.listContainer),
      form: document.getElementById(selectors.form),
      loadingIndicator: document.getElementById(selectors.loadingIndicator),
      errorDisplay: document.getElementById(selectors.errorDisplay),
      emptyState: document.getElementById(selectors.emptyState)
    };
  }

  /**
   * Sets the visual loading state of the application.
   * @param {boolean} isLoading - Active state flag
   */
  showLoading(isLoading) {
    if (this.nodes.loadingIndicator) {
      if (isLoading) {
        this.nodes.loadingIndicator.classList.remove("hidden");
        this.showError(null); // Clear previous errors when reloading
      } else {
        this.nodes.loadingIndicator.classList.add("hidden");
      }
    }
  }

  /**
   * Renders error details if any, else clears the area.
   * @param {string|null} errorMessage - Error details text or null to dismiss
   */
  showError(errorMessage) {
    if (this.nodes.errorDisplay) {
      if (errorMessage) {
        this.nodes.errorDisplay.textContent = errorMessage;
        this.nodes.errorDisplay.classList.remove("hidden");
      } else {
        this.nodes.errorDisplay.classList.add("hidden");
        this.nodes.errorDisplay.textContent = "";
      }
    }
  }

  /**
   * Directs the rendering of items list.
   * @param {Array} items - Array of retrieved cook recipes.
   * @param {Function} onDeleteCallback - Callback triggered when clicking delete values.
   */
  renderItems(items, onDeleteCallback) {
    const container = this.nodes.listContainer;
    if (!container) return;

    // Reset current children contents
    container.innerHTML = "";

    // Toggle empty list overlay representation
    if (this.nodes.emptyState) {
      if (!items || items.length === 0) {
        this.nodes.emptyState.classList.remove("hidden");
        return;
      } else {
        this.nodes.emptyState.classList.add("hidden");
      }
    }

    // Append child entries
    items.forEach(item => {
      const card = document.createElement("div");
      card.id = `item-card-${item.id}`;
      // Clean modern tailwind utility tags (matching full-scale portfolio visual)
      card.className = "bg-white p-6 rounded-lg border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between";

      const difficultyColor = {
        Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Medium: "bg-amber-50 text-amber-700 border-amber-200",
        Hard: "bg-rose-50 text-rose-700 border-rose-200"
      }[item.difficulty] || "bg-slate-50 text-slate-700 border-slate-200";

      // Build internal node contents with structural attributes
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600">${item.category}</span>
            <span class="text-xs border px-2.5 py-0.5 rounded-full font-medium ${difficultyColor}">${item.difficulty}</span>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1 leading-snug">${item.title}</h3>
          <p class="text-slate-600 text-sm mb-4 line-clamp-2">${item.description}</p>
          
          <div class="mb-3">
            <span class="text-xs font-semibold text-slate-400 block mb-1">INGREDIENTS</span>
            <div class="flex flex-wrap gap-1.5">
              ${item.ingredients.map(ing => `<span class="bg-indigo-50/70 border border-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-md font-mono">${ing}</span>`).join("")}
            </div>
          </div>

          <div class="mb-4">
            <span class="text-xs font-semibold text-slate-400 block mb-1">STEPS</span>
            <ol class="list-decimal list-inside text-slate-600 text-xs space-y-1">
              ${item.steps.map(step => `<li>${step}</li>`).join("")}
            </ol>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-4 mt-2 flex justify-end">
          <button 
            type="button" 
            id="btn-delete-${item.id}"
            class="text-xs text-rose-600 font-medium px-3 py-1.5 hover:bg-rose-50 hover:text-rose-700 rounded-md transition-all cursor-pointer flex items-center gap-1"
          >
            Trash Recipe
          </button>
        </div>
      `;

      container.appendChild(card);

      // Secure callback binding
      const btnDelete = card.querySelector(`#btn-delete-${item.id}`);
      if (btnDelete && onDeleteCallback) {
        btnDelete.addEventListener("click", () => onDeleteCallback(item.id));
      }
    });
  }

  /**
   * Resets form fields after correct mutations.
   */
  resetForm() {
    if (this.nodes.form) {
      this.nodes.form.reset();
    }
  }

  /**
   * Reads the form fields and aggregates a standard creation input object.
   * @returns {Object} Structured data mapped to CreateItemInput parameters
   */
  getFormData() {
    if (!this.nodes.form) return null;

    const formData = new FormData(this.nodes.form);
    
    // Split and sanitize list parameters representings
    const ingredientsString = formData.get("ingredients") || "";
    const stepsString = formData.get("steps") || "";

    const ingredients = ingredientsString
      .split(",")
      .map(str => str.trim())
      .filter(str => str.length > 0);

    const steps = stepsString
      .split("\n")
      .map(str => str.trim())
      .filter(str => str.length > 0);

    return {
      title: formData.get("title").toString().trim(),
      category: formData.get("category").toString().trim(),
      description: formData.get("description").toString().trim(),
      difficulty: formData.get("difficulty").toString().trim(),
      ingredients,
      steps
    };
  }
}
