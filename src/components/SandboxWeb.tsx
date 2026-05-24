import React, { useState, useEffect } from "react";
import { Monitor, RefreshCw, Send, Terminal, AlertCircle, Sparkles } from "lucide-react";

interface NetworkLog {
  id: string;
  timestamp: string;
  type: "query" | "mutation";
  name: string;
  status: "pending" | "resolved" | "failed";
  duration: number;
  requestBody: any;
  responseBody: any;
}

export default function SandboxWeb() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Queries");
  const [difficulty, setDifficulty] = useState("Medium");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  // Visual HTTP/GraphQL Network Logs state
  const [logs, setLogs] = useState<NetworkLog[]>([]);

  // Logs append helper
  const addNetworkLog = (
    type: "query" | "mutation",
    name: string,
    requestBody: any,
    status: "pending" | "resolved" | "failed" = "pending",
    duration = 0,
    responseBody: any = null
  ) => {
    const newLog: NetworkLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      name,
      status,
      duration,
      requestBody,
      responseBody
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 14)]);
    return newLog.id;
  };

  const updateNetworkLog = (id: string, status: "resolved" | "failed", duration: number, responseBody: any) => {
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, status, duration, responseBody } : log))
    );
  };

  const fetchItems = async () => {
    setLoading(true);
    setErrorMessage(null);

    const query = `query GetItems {
  items {
    id
    title
    category
    description
    difficulty
    ingredients
    steps
  }
}`;
    const logId = addNetworkLog("query", "GetItems", { query });
    const startTime = performance.now();

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      const json = await response.json();
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      if (json.errors) {
        setErrorMessage(json.errors[0].message);
        updateNetworkLog(logId, "failed", elapsed, json);
      } else {
        setItems(json.data.items || []);
        updateNetworkLog(logId, "resolved", elapsed, json);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network request failed to boot.");
      updateNetworkLog(logId, "failed", 10, { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim()) {
      setErrorMessage("Form validation failed: Recipe Title and Category fields are strict requirements.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const mutation = `mutation CreateItem($input: CreateItemInput!) {
  createItem(input: $input) {
    id
    title
    category
    description
    difficulty
    ingredients
    steps
  }
}`;

    const parsedIngredients = ingredients
      .split(",")
      .map((str) => str.trim())
      .filter((str) => str.length > 0);

    const parsedSteps = steps
      .split("\n")
      .map((str) => str.trim())
      .filter((str) => str.length > 0);

    const variables = {
      input: {
        title: title.trim(),
        category: category.trim(),
        description: description.trim() || "A custom crafted GraphQL masterpiece.",
        difficulty,
        ingredients: parsedIngredients,
        steps: parsedSteps
      }
    };

    const logId = addNetworkLog("mutation", "CreateItem", { query: mutation, variables });
    const startTime = performance.now();

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation, variables })
      });

      const json = await response.json();
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      if (json.errors) {
        setErrorMessage(json.errors[0].message);
        updateNetworkLog(logId, "failed", elapsed, json);
      } else {
        updateNetworkLog(logId, "resolved", elapsed, json);
        // Clear fields
        setTitle("");
        setDescription("");
        setIngredients("");
        setSteps("");
        await fetchItems(); // Sync board
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network mutated request crashed.");
      updateNetworkLog(logId, "failed", 10, { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setLoading(true);
    setErrorMessage(null);

    const mutation = `mutation DeleteItem($id: ID!) {
  deleteItem(id: $id)
}`;
    const variables = { id };
    const logId = addNetworkLog("mutation", "DeleteItem", { query: mutation, variables });
    const startTime = performance.now();

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation, variables })
      });

      const json = await response.json();
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      if (json.errors) {
        setErrorMessage(json.errors[0].message);
        updateNetworkLog(logId, "failed", elapsed, json);
      } else {
        updateNetworkLog(logId, "resolved", elapsed, json);
        await fetchItems();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed deleting recipe.");
      updateNetworkLog(logId, "failed", 10, { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTestErrorSimulation = async () => {
    // Tests unified network client by injecting an deliberately malformed payload
    setErrorMessage(null);
    setLoading(true);

    const query = `query MalformedRequestTest {
      unsupportedFieldSyntaxCheck
    }`;

    const logId = addNetworkLog("query", "MalformedRequest", { query });
    const startTime = performance.now();

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      const json = await response.json();
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      if (json.errors) {
        setErrorMessage(`Simulated Unified client catch: ${json.errors[0].message}`);
        updateNetworkLog(logId, "failed", elapsed, json);
      } else {
        updateNetworkLog(logId, "resolved", elapsed, json);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      updateNetworkLog(logId, "failed", 5, { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
      
      {/* Visual Mock Browser Area: 8 columns */}
      <div className="xl:col-span-8 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
        
        {/* Visual Header / Address Bar Mockup */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 flex items-center justify-between select-none shrink-0 m-0">
          <div className="flex items-center gap-3 w-full max-w-lg">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
              <span className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
              <span className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
            </div>
            {/* Address input mock */}
            <div className="flex-1 flex items-center bg-white border border-slate-250 py-1.5 px-3 rounded-md text-slate-500 font-mono text-[11px] gap-2">
              <Monitor className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">http://localhost:3000/cookbook-front-sandbox/</span>
            </div>
          </div>

          <button
            onClick={fetchItems}
            className="text-slate-500 hover:text-slate-900 p-1.5 hover:bg-gray-200 rounded-md transition-all cursor-pointer"
            title="Reload Browser Grid Data"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Integrated Iframe Body Representation */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 select-text max-h-[82vh] bg-slate-50 text-slate-800">
          
          {/* Header Dashboard section */}
          <div className="bg-slate-900 text-white rounded-lg py-6 px-6 relative overflow-hidden shadow-xs">
            <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-800 px-2.5 py-1 rounded-full border border-slate-705">PORTFOLIO DEPLOY</span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mt-3 mb-1">Cookbook Sandbox</h1>
            <p className="text-slate-200 text-xs max-w-xl leading-relaxed">Vanilla structure interacting with local state APIs via <code>GraphQLClient</code> wrapper.</p>
          </div>

          {/* Core grid layers */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Form Column */}
            <div className="md:col-span-5 bg-white p-5 rounded-lg border border-gray-200 h-fit space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">Add Recipe</h3>
                <p className="text-[11px] text-slate-400 leading-snug">Writes schema values to test live mutations.</p>
              </div>

              {errorMessage && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-[11px] px-3 py-2 rounded-lg leading-relaxed flex gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Resolver Caching"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Category *</label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Queries, Custom..."
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Summary of architectural recipe..."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Ingredients (Comma terms)</label>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. DataLoader, Caching, Node"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Execution Steps (One per line)</label>
                  <textarea
                    rows={2}
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    placeholder="e.g. Step 1: Bind Cache&#10;Step 2: Sync Records"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-md focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-md text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:bg-slate-200 disabled:text-slate-450"
                  >
                    <Send className="h-3 w-3" />
                    Commit Recipe
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleTestErrorSimulation}
                    title="Simulates and tests a malformed request to demonstrate client global error handler triggers."
                    className="bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 px-3 py-2 rounded-md text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Simulate Error
                  </button>
                </div>
              </form>
            </div>

            {/* List View Container */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                <span className="text-xs font-bold text-slate-550 uppercase tracking-widest leading-none">Recipe Catalog Grid</span>
                
                {loading && (
                  <span className="text-[10px] text-indigo-600 font-medium animate-pulse flex items-center gap-1">
                    Connecting Backend Graph...
                  </span>
                )}
              </div>

              {items.length === 0 ? (
                <div className="bg-slate-100 rounded-xl py-12 px-4 border border-dashed border-slate-200 text-center select-none">
                  <p className="text-xs font-bold text-slate-600 mb-0.5">Kitchen Pantry is Clean</p>
                  <p className="text-[11px] text-slate-400">Add custom recipe inputs to witness mutations triggered live.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item) => {
                    const diffColors = {
                      Easy: "bg-emerald-50 text-emerald-700 border-emerald-250",
                      Medium: "bg-amber-50 text-amber-700 border-amber-250",
                      Hard: "bg-rose-50 text-rose-700 border-rose-250"
                    }[item.difficulty as "Easy" | "Medium" | "Hard"] || "bg-slate-50 border-slate-200";

                    return (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-lg border border-gray-250/80 shadow-xs hover:shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-2 select-none">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 truncate max-w-[80px]">
                              {item.category}
                            </span>
                            <span className={`text-[9px] border px-2 py-0.2 rounded-full font-semibold ${diffColors}`}>
                              {item.difficulty}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 mb-1 leading-tight">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 mb-3 leading-normal break-words">{item.description}</p>

                          {item.ingredients && item.ingredients.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.ingredients.map((ing: string) => (
                                <span
                                  key={ing}
                                  className="bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[9px] px-1.5 py-0.2 rounded-sm"
                                >
                                  {ing}
                                </span>
                              ))}
                            </div>
                          )}

                          {item.steps && item.steps.length > 0 && (
                            <ol className="list-decimal list-inside text-[10px] text-slate-500 space-y-0.5 mb-1.5">
                              {item.steps.map((st: string, idx: number) => (
                                <li key={idx} className="truncate select-text">
                                  {st}
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>

                        <div className="border-t border-slate-100 pt-3 mt-3 flex justify-end">
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="text-[10px] text-rose-500 font-bold hover:bg-rose-50 px-2 py-1.5 rounded-md transition-all cursor-pointer"
                          >
                            Trash Recipe
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Network Diagnostics Inspector Panel: 4 columns */}
      <div className="xl:col-span-4 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden text-slate-700 h-full shadow-xs">
        
        {/* Panel Header */}
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between select-none shrink-0 m-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-indigo-600 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-800">GRAPHQL NETWORK INSPECTOR</span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-[10px] text-slate-500 hover:text-slate-900 font-bold transition-all font-mono cursor-pointer"
          >
            CLEAR LOGS
          </button>
        </div>

        {/* Dynamic Log Entries list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[11px] leading-relaxed select-text min-h-[300px]">
          
          <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-md text-indigo-900 text-[10.5px] select-none flex gap-2 mb-3 leading-relaxed">
            <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <strong>DIAGNOSTIC TIP:</strong> Trigger CRUD flows left. The logs below isolate and expose exact GraphQL transaction streams so you can inspect headers, variables, and responses.
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="text-slate-400 h-[300px] flex items-center justify-center text-center select-none font-sans text-[11.5px]">
              Awaiting transactions. Click visual triggers on the browser mock screen left.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="bg-gray-50/50 border border-gray-200 rounded-md p-3 space-y-2 select-text font-mono">
                <div className="flex items-center justify-between border-b border-gray-200 pb-1.5 select-none">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        log.status === "resolved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                          : log.status === "failed"
                          ? "bg-rose-50 text-rose-700 border-rose-250"
                          : "bg-slate-100 text-slate-600 border-gray-200"
                      }`}
                    >
                      {log.status === "resolved" ? "POST 200" : log.status === "failed" ? "POST ERROR" : "PENDING"}
                    </span>
                    <span className="text-[10px] font-bold tracking-tight text-slate-800 font-sans">
                      {log.name}
                    </span>
                  </div>

                  <div className="text-slate-450 text-[9.5px] flex items-center gap-1 font-sans">
                    <span>{log.timestamp}</span>
                    {log.duration > 0 && <span>| {log.duration}ms</span>}
                  </div>
                </div>

                <div className="space-y-2 text-slate-600 select-text font-mono text-[10.5px]">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[9px] block mb-1">GraphQL Document Payload:</span>
                    <pre className="bg-slate-900 p-2.5 rounded border border-slate-950 overflow-x-auto text-emerald-400 select-text max-h-[85px]">
                      {log.requestBody.query}
                    </pre>
                  </div>

                  {log.requestBody.variables && Object.keys(log.requestBody.variables).length > 0 && (
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block mb-1">Injected Input Variables:</span>
                      <pre className="bg-slate-900 p-2.5 rounded border border-slate-950 text-indigo-300 max-h-[140px] overflow-auto">
                        {JSON.stringify(log.requestBody.variables, null, 2)}
                      </pre>
                    </div>
                  )}

                  {log.responseBody && (
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block mb-1">Returned Response JSON:</span>
                      <pre className="bg-slate-900 p-2.5 rounded border border-slate-950 overflow-x-auto text-slate-350 select-text max-h-[140px]">
                        {JSON.stringify(log.responseBody, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
