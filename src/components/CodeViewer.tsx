import React, { useState } from "react";
import { Check, Copy, ShieldCheck } from "lucide-react";
import { CodeFileContext } from "../types";

interface CodeViewerProps {
  file: CodeFileContext;
}

export default function CodeViewer({ file }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple, elegant, high-fidelity custom regex syntax highlighting rules
  const highlightCode = (rawCode: string) => {
    // Escape standard HTML tags safely
    let html = rawCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Single-pass combined regex to avoid double-matching and nested HTML replacements
    const combinedRegex = /(\/\/.*)|((["'`])(?:\\.|[^\\])*?\3)|(\b(?:const|return|let|class|export|import|from|async|await|try|catch|throw|function|new|type|input|query|mutation)\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)(?=\s*\()|(\b\d+\b)/g;

    return html.replace(combinedRegex, (match, comment, stringLiteral, stringQuote, keyword, funcName, numberVal) => {
      if (comment) {
        return `<span class="text-slate-400 italic">${comment}</span>`;
      }
      if (stringLiteral) {
        return `<span class="text-emerald-600 font-medium">${stringLiteral}</span>`;
      }
      if (keyword) {
        return `<span class="text-purple-600 font-bold">${keyword}</span>`;
      }
      if (funcName) {
        return `<span class="text-blue-600 font-medium">${funcName}</span>`;
      }
      if (numberVal) {
        return `<span class="text-amber-600 font-medium">${numberVal}</span>`;
      }
      return match;
    });
  };

  const lines = file.code.split("\n");

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs hover:shadow-sm transition-all">
      {/* Target heading and control handles */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-2">
          {/* Mock visual decorations */}
          <div className="flex gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 bg-slate-200 rounded-full border border-slate-300" />
            <span className="w-2.5 h-2.5 bg-slate-250 rounded-full border border-slate-300" />
            <span className="w-2.5 h-2.5 bg-slate-300 rounded-full border border-slate-355" />
          </div>
          <span className="text-slate-300 font-mono text-xs px-2 select-none">|</span>
          <span className="text-xs font-mono font-medium text-slate-700 select-all">{file.path}</span>
        </div>

        <button
          id={`btn-copy-${file.title.replace(/[^a-zA-Z0-9]/g, "-")}`}
          onClick={handleCopy}
          className="text-xs text-slate-600 hover:text-slate-950 flex items-center gap-1.5 bg-white py-1 px-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer shadow-xs"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* Embedded core architectural description */}
      <div className="bg-indigo-50/40 p-4 border-b border-gray-150 text-xs text-indigo-950 leading-relaxed flex gap-3 select-none">
        <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-indigo-700 mr-1.5 uppercase tracking-wider">DESIGN PURPOSE:</span>
          {file.purpose}
        </div>
      </div>

      {/* Editor layout scroll container */}
      <div className="overflow-auto flex-1 font-mono text-[12px] leading-relaxed p-4 bg-white text-slate-800 select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-all">
                <td className="w-9 text-slate-400 text-right pr-4 select-none border-r border-gray-100 text-[10px]">
                  {idx + 1}
                </td>
                <td
                  className="pl-4 text-slate-850 whitespace-pre"
                  dangerouslySetInnerHTML={{ __html: highlightCode(line) }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
