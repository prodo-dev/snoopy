export interface ComponentImport {
  filepath: string;
  componentExports: Export[];
}

export interface Export {
  name: string;
  defaultExport: boolean;
}
