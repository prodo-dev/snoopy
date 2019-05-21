import * as React from "react";
import Button from "../src/components/Button";

export default Button;

export const basic = () => (
  <Button onClick={() => alert("click!")}>Hello World</Button>
);
