import * as React from "react";

export interface Component {
  path: string;
  name: string;
  component: React.ComponentType<any>;
  examples: Example[];
}

export interface FileError {
  path: string;
  errors: string[];
}

export interface ExampleImport {
  forComponent: React.ComponentType<any>;
  examples: Example[];
}

export interface Example {
  title: string;
  component: React.ComponentType<any>;
  source?: string;
}

export interface Theme {
  name: string;
  theme: any;
}

export interface Style {
  name: string;
  style: string;
  path: string;
}

export interface Context {
  themes: {[name: string]: Theme};
  components: Component[];
  styles: Style[];
  errors: FileError[];
}

export type FilePath = string;

export interface Directory {
  type: "directory";
  path: FilePath;
  children: {
    [segment: string]: Directory | File;
  };
}

export interface File {
  type: "file";
  path: FilePath;
}

export const emptyContext: Context = {
  themes: {},
  components: [],
  styles: [],
  errors: [],
};
