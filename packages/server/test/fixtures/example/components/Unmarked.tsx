import * as React from "react";

export const Button = (props: any) => (
  <button {...props}>{props.children}</button>
);

export const Button2 = (props: any) => (
  <button {...props}>{props.children}</button>
);

export default (props: any) => <button {...props}>{props.children}</button>;
