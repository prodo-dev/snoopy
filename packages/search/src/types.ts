import {Visitor} from "@babel/traverse";

export interface SearchResult {
  componentFiles: File[];
  themeFiles: File[];
  styleFiles: File[];
  examples: File[];
}

export interface File {
  filepath: string;
  fileExports: FileExport[];
  errors: FileError[];
}

export type FileExport =
  | {isDefaultExport: true; source?: string}
  | {
      isDefaultExport: false;
      name: string;
      source?: string;
    };

export class FileError extends Error {
  public readonly filepath: string;

  constructor(filepath: string, message: string) {
    super(message);
    this.filepath = filepath;
  }
}

export type ExtractType = "styleFiles" | "componentFiles" | "themeFiles";

export interface VisitorState {
  filepath: string;
  fileExports: FileExport[];
  errors: FileError[];
  componentNames: string[];
}

export interface VisitorOptions {
  lineRegex?: RegExp;
  invalidProdoTagError?: string;
  ignoreDefaultExport?: boolean;
}

export type ExportVisitor = Visitor<VisitorState>;
