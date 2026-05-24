import React, { useState } from "react";
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { FileTreeNode } from "../types";

interface FileExplorerProps {
  nodes: FileTreeNode[];
  selectedFileKey: string | null;
  onSelectFile: (contentKey: string, filePath: string) => void;
}

export default function FileExplorer({ nodes, selectedFileKey, onSelectFile }: FileExplorerProps) {
  return (
    <div className="font-sans text-sm select-none">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5 px-2">Workspace Explorer</div>
      <div className="space-y-1">
        {nodes.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            depth={0}
            selectedFileKey={selectedFileKey}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  key?: string;
  node: FileTreeNode;
  depth: number;
  selectedFileKey: string | null;
  onSelectFile: (contentKey: string, filePath: string) => void;
}

function TreeNode({ node, depth, selectedFileKey, onSelectFile }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);

  const isDirectory = node.type === "directory";
  const isSelected = !isDirectory && node.contentKey === selectedFileKey;

  const handleToggle = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else if (node.contentKey) {
      onSelectFile(node.contentKey, node.path);
    }
  };

  return (
    <div>
      <div
        id={`node-row-${node.path.replace(/[/.]/g, "-")}`}
        onClick={handleToggle}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        className={`flex items-center justify-between py-1.5 pr-2 rounded-md cursor-pointer transition-all ${
          isSelected
            ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100"
            : "text-slate-600 hover:bg-gray-100 hover:text-slate-900"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {isDirectory ? (
            <span className="shrink-0 text-slate-400">
              {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </span>
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          {isDirectory ? (
            isOpen ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-indigo-500" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-indigo-500" />
            )
          ) : (
            <FileText className={`h-4 w-4 shrink-0 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
          )}

          <span className="truncate text-xs font-mono">{node.name}</span>
        </div>
      </div>

      {isDirectory && isOpen && node.children && (
        <div className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedFileKey={selectedFileKey}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
