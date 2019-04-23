import * as React from "react";

export interface Component {
  name: string;
  component: React.ComponentType<any>;
}

export interface Example {
  name: string;
  jsx: React.ReactNode;
}
