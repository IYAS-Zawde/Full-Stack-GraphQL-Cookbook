/**
 * @file types.ts
 * @description State type declarations for the Full-Stack Developer Workbench.
 */

export interface CookItem {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  steps: string[];
}

export type WorkbenchTab = "explorer" | "playground" | "sandbox" | "tutorial";

export interface FileTreeNode {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileTreeNode[];
  contentKey?: string; // Links to preloaded data strings
}

export interface CodeFileContext {
  title: string;
  path: string;
  language: string;
  purpose: string;
  code: string;
}
