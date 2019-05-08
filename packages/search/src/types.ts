export interface SearchResult {
  componentFiles: File[];
  themeFiles: File[];
}

export interface File {
  filepath: string;
  fileExports: FileExport[];
  errors: FileError[];
}

export type FileExport =
  | {isDefaultExport: true}
  | {
      isDefaultExport: false;
      name: string;
    };

export class FileError extends Error {
  public readonly filepath: string;

  constructor(filepath: string, message: string) {
    super(message);
    this.filepath = filepath;
  }
}
