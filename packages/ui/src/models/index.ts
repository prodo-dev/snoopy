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

export interface Example {
  title: string;
  component: React.ComponentType<any>;
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
  themes: Theme[];
  components: Component[];
  styles: Style[];
  errors: FileError[];
}
