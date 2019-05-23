import * as React from "react";

// @snoopy
export const Button = (props: any) => (
  <button {...props}>{props.children}</button>
);

// @snoopy
export const Button2 = (props: any) => (
  <button {...props}>{props.children}</button>
);

// @snoopy
export default (props: any) => <button {...props}>{props.children}</button>;
