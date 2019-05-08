import * as React from "react";

export interface Component {
  path: string;
  name: string;
  component: React.ComponentType<any>;
}

export interface Example {
  name: string;
  jsx: React.ReactNode;
}

export interface Theme {
  name: string;
  theme: any;
}
