export interface ComponentImport {
  filepath: string;
  componentExports: Export[];
  errors: FileError[];
}

export interface Export {
  name: string;
  defaultExport: boolean;
}

export class FileError extends Error {
  public readonly filepath: string;

  constructor(filepath: string, message: string) {
    super(message);
    this.filepath = filepath;
  }
}
