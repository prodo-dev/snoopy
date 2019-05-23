import * as React from "react";

// @snoopy
export const Button = (props: any) => (
  <button {...props}>{props.children}</button>
);
