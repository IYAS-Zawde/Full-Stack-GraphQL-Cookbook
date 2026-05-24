import React, { useState } from "react";
import { Play, RotateCcw, HelpCircle, Activity, Server, FileSignature, Layers } from "lucide-react";

interface QueryTemplate {
  name: string;
  type: "query" | "mutation";
  query: string;
  variables: string;
  description: string;
}

const PLAYGROUND_TEMPLATES: QueryTemplate[] = [
  {
    name: "Query: fetch item recipes list",
    type: "query",
    description: "Requests all recipes from the service pantry database representation. Demonstrates resolvers calling ItemService.getAll().",
    query: `query GetItems {
  items {
    id
    title
    category
    description
    difficulty
    ingredients
    steps
  }
}`,
    variables: `{}`
  },
  {
    name: "Mutation: write a new item recipe",
    type: "mutation",
    description: "Injects and asserts a new item inside the business logic array. Resolvers invoke ItemService.create(input).",
    query: `mutation CreateItem($input: CreateItemInput!) {
  createItem(input: $input) {
    id
    title
    category
    description
    difficulty
    ingredients
    steps
  }
}`,
    variables: `{
  "input": {
    "title": "GraphQL Subscriptions Sauce",
    "category": "Subscriptions",
    "description": "How to handle pub/sub push events using Apollo Server WebSocket transports safely.",
    "difficulty": "Hard",
    "ingredients": ["Apollo Subscriptions", "WebSockets Token", "Redis pub/sub"],
    "steps": [
      "Attach a modular subscription WebSocket pipeline to Express.",
      "Publish change payloads from the service mutation handler.",
      "Stream notifications to authenticated client list DOMs automatically."
    ]
  }
}`
  },
  {
    name: "Mutation: delete item by identifier",
    type: "mutation",
    description: "Trashes an active recipe model. Resolvers invoke ItemService.delete(id).",
    query: `mutation DeleteItem($id: ID!) {
  deleteItem(id: $id)
}`,
    variables: `{
  "id": "item-1"
}`
  }
];

export default function Playground() {
  const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);
  const [queryString, setQueryString] = useState(PLAYGROUND_TEMPLATES[0].query);
  const [variablesString, setVariablesString] = useState(PLAYGROUND_TEMPLATES[0].variables);
  const [responsePayload, setResponsePayload] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<string[]>([]);

  const handleSelectTemplate = (idx: number) => {
    setActiveTemplateIdx(idx);
    setQueryString(PLAYGROUND_TEMPLATES[idx].query);
    setVariablesString(PLAYGROUND_TEMPLATES[idx].variables);
  };

  const handleRunQuery = async () => {
    setLoading(true);
    setResponsePayload(null);
    setExecutionSteps([]);

    // Stagger tracing step animations to visually demonstrate Separation of Concerns
    const steps: string[] = [];
    const triggerStep = (text: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          steps.push(text);
          setExecutionSteps([...steps]);
          resolve();
        }, delay);
      });
    };

    await triggerStep("📡 HTTP POST Request initiated to '/api/graphql'...", 150);
    await triggerStep("🛡️ SDL Validation Contract Verified (item.typedefs.js)", 200);
    await triggerStep("🎯 Controller Route Dispatched (item.resolvers.js)", 250);
    await triggerStep("⚡ Service Database Logic Executed (item.service.js)", 250);

    let parsedVariables = {};
    try {
      if (variablesString.trim()) {
        parsedVariables = JSON.parse(variablesString);
      }
    } catch (e) {
      setResponsePayload({
        errors: [{ message: "JSON variables parsing failed: Ensure parameter block is a valid JSON dictionary." }]
      });
      await triggerStep("🛑 Execution Aborted: Invalid Variables JSON Payload.", 100);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: queryString,
          variables: parsedVariables
        })
      });

      const json = await response.json();
      setResponsePayload(json);

      if (json.errors) {
        await triggerStep("⚠️ Execution Completed with GraphQL Exception structure.", 150);
      } else {
        await triggerStep("✅ Data Resolved cleanly. Response payload drawn successfully.", 150);
      }

    } catch (err: any) {
      setResponsePayload({
        errors: [{ message: err.message || "Network transaction crashed." }]
      });
      await triggerStep("❌ Server network fault occurred during execution.", 100);
    } finally {
      setLoading(false);
    }
  };

  const handleResetWorkspace = () => {
    setQueryString(PLAYGROUND_TEMPLATES[activeTemplateIdx].query);
    setVariablesString(PLAYGROUND_TEMPLATES[activeTemplateIdx].variables);
    setResponsePayload(null);
    setExecutionSteps([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full font-sans text-slate-700">
      
      {/* Sidebar Template selection panel: 4 columns */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-col gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            Query Templates Index
          </div>
          <p className="text-slate-500 text-xs font-medium">Choose pre-built operations to test standard contracts on-the-fly:</p>
          
          <div className="space-y-2 mt-1">
            {PLAYGROUND_TEMPLATES.map((tmpl, idx) => (
              <button
                key={tmpl.name}
                onClick={() => handleSelectTemplate(idx)}
                className={`w-full text-left p-3 rounded-lg border text-xs leading-normal transition-all cursor-pointer ${
                  activeTemplateIdx === idx
                    ? "bg-indigo-50 border-indigo-200 text-indigo-805 font-medium"
                    : "bg-gray-50/50 border-gray-150 text-slate-600 hover:border-gray-250 hover:bg-gray-50"
                }`}
              >
                <div className={`font-mono font-bold mb-1 select-none ${activeTemplateIdx === idx ? "text-indigo-900" : "text-slate-800"}`}>{tmpl.name}</div>
                <div className={`text-[11px] font-sans ${activeTemplateIdx === idx ? "text-indigo-950/80" : "text-slate-500"}`}>{tmpl.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Layer Tracing Log */}
        <div className="bg-white border border-gray-200 p-5 rounded-lg flex-1 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <Activity className="h-4 w-4" />
            Active Layer Tracing
          </div>
          <p className="text-slate-505 text-xs font-medium leading-normal">Watch live execution streams separate layers dynamically upon trigger:</p>
          
          <div className="flex-1 bg-slate-900 p-4 rounded-md border border-slate-850 font-mono text-[11px] space-y-2.5 overflow-auto shadow-inner text-slate-300">
            {executionSteps.length === 0 ? (
              <div className="text-slate-500 flex items-center justify-center h-full text-center py-10 font-sans">
                Awaiting request. Press "Run Operation" above.
              </div>
            ) : (
              executionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 animate-fade-in ${
                    step.includes("✅")
                      ? "text-emerald-400 font-semibold"
                      : step.includes("🛡️")
                      ? "text-indigo-300"
                      : "text-slate-300"
                  }`}
                >
                  <span className="text-slate-500 shrink-0 select-none">[{idx + 1}]</span>
                  <span className="leading-normal">{step}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Primary Query Editor + Variables Input: 8 columns */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[440px]">
          
          {/* Query Editor Node */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-xs">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center select-none">
              <span className="text-xs font-mono font-bold text-slate-600">GRAPHQL PLAYGROUND QUERY</span>
              <div className="flex gap-2">
                <button
                  onClick={handleResetWorkspace}
                  title="Reset code editor values"
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <textarea
              value={queryString}
              onChange={(e) => setQueryString(e.target.value)}
              className="flex-1 w-full bg-slate-900 text-emerald-400 font-mono text-xs p-4 leading-relaxed outline-hidden border-none resize-none shadow-inner"
              spellCheck={false}
            />

            {/* Variable entry block */}
            <div className="border-t border-gray-200 bg-white flex flex-col h-[180px]">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50/50 select-none">
                <span className="text-[10px] font-mono font-bold text-slate-500">QUERY VARIABLES (JSON)</span>
              </div>
              <textarea
                value={variablesString}
                onChange={(e) => setVariablesString(e.target.value)}
                className="flex-1 w-full bg-slate-900/95 text-indigo-300 font-mono text-xs p-4 leading-relaxed outline-hidden border-none resize-none shadow-inner"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Core Response Visualizer */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-xs">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center select-none">
              <span className="text-xs font-mono font-bold text-slate-600">RESPONSE JSON PAYLOAD</span>
              <div className="flex gap-1.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400 animate-ping" : responsePayload?.errors ? "bg-rose-500" : responsePayload ? "bg-emerald-500" : "bg-slate-400"}`} />
              </div>
            </div>

            <div className="flex-1 bg-slate-900 font-mono text-xs p-4 overflow-auto leading-relaxed text-indigo-200 whitespace-pre scrollbar-thin select-text shadow-inner">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 select-none font-sans">
                  <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Processing transaction contract server-side...
                </div>
              ) : responsePayload ? (
                <span>{JSON.stringify(responsePayload, null, 2)}</span>
              ) : (
                <div className="text-slate-500 flex items-center justify-center h-full text-center py-10 select-none font-sans">
                  No execution triggered. Press "Run Operation" below.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Primary actionable trigger panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-gray-200 rounded-lg shadow-xs">
          <div className="flex items-center gap-2 select-none">
            <Server className="h-4 w-4 text-indigo-600" />
            <span className="text-xs text-slate-500">Target sandbox API endpoint: </span>
            <span className="text-xs text-slate-705 font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">/api/graphql</span>
          </div>

          <button
            onClick={handleRunQuery}
            disabled={loading}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-md text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Run Operation
          </button>
        </div>

      </div>
    </div>
  );
}
