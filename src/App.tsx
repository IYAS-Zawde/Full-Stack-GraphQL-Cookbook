import React, { useState } from "react";
import { FolderCode, Terminal, HelpCircle, MonitorDot, Files, Cpu, ExternalLink } from "lucide-react";
import { repositoryTree, repositoryFiles } from "./data";
import { WorkbenchTab } from "./types";
import FileExplorer from "./components/FileExplorer";
import CodeViewer from "./components/CodeViewer";
import Playground from "./components/Playground";
import SandboxWeb from "./components/SandboxWeb";
import TutorialViewer from "./components/TutorialViewer";

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>("explorer");
  
  // File Explorer State
  const [selectedFileKey, setSelectedFileKey] = useState<string>("item.service.js");
  const [selectedFilePath, setSelectedFilePath] = useState<string>("backend/src/services/item.service.js");

  const handleSelectFile = (contentKey: string, filePath: string) => {
    setSelectedFileKey(contentKey);
    setSelectedFilePath(filePath);
  };

  const selectedFile = repositoryFiles[selectedFileKey];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-slate-900 font-sans antialiased">
      
      {/* Upper Navigation Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none shrink-0 m-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg text-white shadow-xs">
            <Cpu className="h-6 w-6 stroke-[1.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">GraphQL Cookbook</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Senior Portfolio
              </span>
            </div>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1.5">Clean Architecture • Domain Driven Design</p>
          </div>
        </div>

        {/* Global tab controllers */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto">
          <button
            id="tab-btn-explorer"
            onClick={() => { setActiveTab("explorer"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "explorer"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Files className="h-4 w-4 text-slate-500" />
            File Explorer
          </button>

          <button
            id="tab-btn-playground"
            onClick={() => { setActiveTab("playground"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "playground"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Terminal className="h-4 w-4 text-slate-500" />
            GraphQL Playground
          </button>

          <button
            id="tab-btn-sandbox"
            onClick={() => { setActiveTab("sandbox"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "sandbox"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <MonitorDot className="h-4 w-4 text-slate-500" />
            Visual Sandbox
          </button>

          <button
            id="tab-btn-tutorial"
            onClick={() => { setActiveTab("tutorial"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "tutorial"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <HelpCircle className="h-4 w-4 text-slate-500" />
            Architecture Tutorial
          </button>
        </div>
      </header>

      {/* Main Container Sandbox Stage */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-hidden">
        
        {/* Dynamic workspace tab render block */}
        <div className="h-full">
          {activeTab === "explorer" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
              
              {/* Left pane: File Explorer tree (3 columns) */}
              <div className="md:col-span-3 bg-white border border-gray-200 rounded-lg p-5 overflow-y-auto select-none max-h-[82vh] shadow-xs">
                <FileExplorer
                  nodes={repositoryTree}
                  selectedFileKey={selectedFileKey}
                  onSelectFile={handleSelectFile}
                />
              </div>

              {/* Right pane: Active Code Viewer (9 columns) */}
              <div className="md:col-span-9 h-full flex flex-col max-h-[82vh]">
                {selectedFile ? (
                  <CodeViewer file={selectedFile} />
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg flex-1 flex flex-col items-center justify-center text-slate-400 py-20 select-none shadow-xs">
                    <FolderCode className="h-12 w-12 text-slate-300 mb-4 stroke-1 animate-pulse" />
                    <p className="text-sm font-semibold text-slate-700">Pantry contains no active code file representations.</p>
                    <p className="text-xs text-slate-500 mt-1">Please select an asset from the File Explorer directory schema on the left.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === "playground" && (
            <div className="h-full">
              <Playground />
            </div>
          )}

          {activeTab === "sandbox" && (
            <div className="h-full">
              <SandboxWeb />
            </div>
          )}

          {activeTab === "tutorial" && (
            <div className="h-full">
              <TutorialViewer />
            </div>
          )}
        </div>

      </main>

      {/* Unified footer diagnostics */}
      <footer className="bg-white border-t border-gray-200 py-3.5 px-6 text-center text-[10px] text-slate-500 shrink-0 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 Developer Portfolio Studio. Clean Architecture Standard.</span>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
              STATUS <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> ACTIVE MOCK DB
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 font-mono uppercase bg-gray-100 py-0.5 px-2 rounded border border-gray-200 text-[9.5px]">
              Vite dev port: 3000
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
