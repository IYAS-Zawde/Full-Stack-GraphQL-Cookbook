import React, { useState } from "react";
import { BookOpen, HelpCircle, Code, ShieldCheck, Terminal, Compass, LayoutList } from "lucide-react";

export default function TutorialViewer() {
  const [activeSubTab, setActiveSubTab] = useState<"tutorial" | "readme">("tutorial");

  return (
    <div className="font-sans text-slate-705 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      
      {/* Structural layout navigations: 4 columns */}
      <div className="lg:col-span-4 flex flex-col gap-5 select-none">
        <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-col gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
            <Compass className="h-4 w-4" />
            Tutorial Navigation
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">Navigate between full-scale guides built directly inside your repository workspace:</p>
          
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={() => setActiveSubTab("tutorial")}
              className={`w-full text-left p-3.5 rounded-lg border text-xs leading-normal transition-all cursor-pointer ${
                activeSubTab === "tutorial"
                  ? "bg-slate-100 border-slate-300 text-slate-900 font-bold shadow-xs scale-[1.01]"
                  : "bg-gray-50/50 border-gray-200 text-slate-500 hover:border-gray-305 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                <BookOpen className="h-3.5 w-3.5 text-indigo-605" />
                TUTORIAL.md - Walkthrough
              </div>
              <div className="text-[11px] opacity-80 pl-5 leading-normal">Deep theory on SOLID, Decoupling, Resolvers vs Services, and HTTP 200 checks.</div>
            </button>

            <button
              onClick={() => setActiveSubTab("readme")}
              className={`w-full text-left p-3.5 rounded-lg border text-xs leading-normal transition-all cursor-pointer ${
                activeSubTab === "readme"
                  ? "bg-slate-100 border-slate-300 text-slate-900 font-bold shadow-xs scale-[1.01]"
                  : "bg-gray-50/50 border-gray-200 text-slate-500 hover:border-gray-305 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                <Code className="h-3.5 w-3.5 text-indigo-605" />
                README.md - Quick Start
              </div>
              <div className="text-[11px] opacity-80 pl-5 leading-normal">Repository layout structure maps, scripts setup commands, and unit tests integration models.</div>
            </button>
          </div>
        </div>

        {/* Short info callout list card */}
        <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-col gap-3.5 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            Architect's Pledge
          </div>
          <p className="text-slate-505 inline leading-relaxed font-sans text-[11.5px]">
            By avoiding mixed variables (like injecting state arrays in resolvers or raw fetch in html layouts) you ensure that moving to databases such as PostgreSQL or frameworks like React takes hours instead of weeks of rewrite loops.
          </p>

          <div className="border-t border-gray-200 pt-3">
            <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1 tracking-wider font-sans">SOLID COUPLING INDEX</span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px]">
              <div>
                <span className="text-slate-500 font-sans">Resolvers: </span>
                <span className="text-emerald-700 font-bold">Thin</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans">Service DAL: </span>
                <span className="text-emerald-700 font-bold">Pure</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans">UI Renderer: </span>
                <span className="text-emerald-700 font-bold">Passive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Guide content renderer: 8 columns */}
      <div className="lg:col-span-8 bg-white border border-gray-200 p-6 md:p-8 rounded-lg overflow-y-auto leading-relaxed max-h-[82vh] text-sm text-slate-700 shadow-xs">
        
        {activeSubTab === "tutorial" ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <span className="text-indigo-650 font-mono text-xs font-bold uppercase tracking-wider">GUIDEBOOK ARTICLE</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1 mb-2">Masterclass: Separation of Concerns in GraphQL</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-sm" />
            </div>

            <p className="text-slate-500 leading-relaxed text-xs">
              This curriculum explores the inner layers of our custom repository boilerplate, justifying layout conventions, interface isolation, and data mapping parameters suitable for professional developers portfolios.
            </p>

            <div className="bg-indigo-50/50 p-4 rounded-md border border-indigo-100 flex gap-3 text-xs leading-relaxed">
              <ShieldCheck className="h-5 w-5 text-indigo-605 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-950">CORE STANDARD ENFORCED:</span> Resolvers are strictly disallowed from containing direct array storage references or manipulation models. They must delegate inquiries strictly to isolated systems to preserve pure execution flows.
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-slate-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                <span className="text-indigo-650 shrink-0 font-mono">[Tier 1]</span>
                Schema Definition Language Design
              </h3>
              <p className="text-slate-505 leading-relaxed text-xs">
                In multi-team setups, frontend engineers require early contracts to prevent visual grid blocks. <code>item.typedefs.js</code> outlines clear inputs (<code>CreateItemInput</code>), query targets (<code>Query</code>), and mutation paths (<code>Mutation</code>) in standard contract schemas. Frontends can begin writing mockup layers immediately while server engineers integrate DB schemas downstream.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-bold text-slate-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                <span className="text-indigo-650 shrink-0 font-mono">[Tier 2]</span>
                Thin Resolvers Mapping
              </h3>
              <p className="text-slate-505 leading-relaxed text-xs">
                Apollo Resolvers represent HTTP routers. If database validations or password-salting parameters spill into resolvers, their tests require mocking Apollo Context systems (which is slow and expensive). Refactoring validations into modular domain functions inside <code>item.service.js</code> simplifies routing controllers down to a single instruction delegate call.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-bold text-slate-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                <span className="text-indigo-650 shrink-0 font-mono">[Tier 3]</span>
                The 200 OK GraphQL Response Trap
              </h3>
              <p className="text-slate-505 leading-relaxed text-xs">
                A famous trap for GraphQL newbies: Server responses for execution faults almost always return HTTP status <code>200 OK</code>! If you query an item that doesn't exist, the core engine processes the contract cleanly and packs error strings into a custom <code>errors</code> JSON nested array. By wrapping and checking this structure centrally inside <code>graphqlClient.js</code>, our applications capture warnings before forms crash silently!
              </p>
              
              <div className="bg-slate-900 p-4 rounded border border-slate-950 font-mono text-xs text-indigo-300 space-y-1">
                <div>{"// Sample network audit capture in client.js"}</div>
                <div>{"const json = await response.json();"}</div>
                <div>{"if (json.errors && json.errors.length > 0) {"}</div>
                <div className="pl-4">{"throw new Error(`GraphQL Fault: ${json.errors[0].message}`);"}</div>
                <div>{"}"}</div>
              </div>
            </div>

          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <span className="text-indigo-650 font-mono text-xs font-bold uppercase tracking-wider">PROJECT MANUAL</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1 mb-2">README.md Setup Guide</h2>
              <div className="h-1 w-12 bg-indigo-600 rounded-sm" />
            </div>

            <p className="text-slate-505 leading-relaxed text-xs">
              Below represents the developer installation scripts and commands dictionary needed to spin up your portfolio boilerplate project locally.
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-550 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-1.5 select-none font-sans">
                <Terminal className="h-3.5 w-3.5 text-indigo-600" />
                1. System Boot backend
              </h4>
              <p className="text-slate-505 text-xs font-sans">Configure the server variables inside an environment local sheet and initialize standard dependencies:</p>
              <pre className="bg-slate-900 p-3.5 rounded border border-slate-950 font-mono text-xs text-indigo-300 select-all overflow-x-auto">
{`cd backend
npm install
npm run dev`}
              </pre>
            </div>

            <div className="space-y-3 pt-3">
              <h4 className="text-xs font-bold text-slate-550 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-1.5 select-none font-sans">
                <Terminal className="h-3.5 w-3.5 text-indigo-600" />
                2. Serves static viewport
              </h4>
              <p className="text-slate-505 text-xs font-sans">Run a plain local server to test the static presentation layers without compiling hassles:</p>
              <pre className="bg-slate-900 p-3.5 rounded border border-slate-950 font-mono text-xs text-indigo-350 select-all overflow-x-auto">
{`# Option A: NodeJS local live server
npx live-server frontend

# Option B: Python raw sockets
python3 -m http.server 3000 --directory frontend`}
              </pre>
            </div>

            <div className="space-y-3 pt-3">
              <h4 className="text-xs font-bold text-slate-550 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-1.5 select-none font-sans">
                <LayoutList className="h-3.5 w-3.5 text-indigo-600" />
                3. Directory Layout Blueprint Overview
              </h4>
              <p className="text-slate-505 text-xs font-sans">Enterprise domain structure mappings grouped cleanly by modular concerns:</p>
              <ul className="text-slate-500 text-xs list-disc list-inside space-y-1.5 pl-2 leading-relaxed font-sans">
                <li><code>backend/src/config/index.js</code> - Type checks inputs variables models.</li>
                <li><code>backend/src/graphql/schema/item.typedefs.js</code> - Defines API contracts schemas.</li>
                <li><code>backend/src/graphql/resolvers/item.resolvers.js</code> - Minimalistic queries and mutations traffic controllers.</li>
                <li><code>backend/src/services/item.service.js</code> - Core Service containing array memory state validations.</li>
                <li><code>frontend/src/api/graphqlClient.js</code> - Reusable fetch network layer detecting nested GraphQL errors.</li>
              </ul>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
