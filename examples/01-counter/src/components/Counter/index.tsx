import * as React from "react";

import "./index.css";

export const Counter = ({count}: {count: number}) => (
  <p className="counter">{count}</p>
);

export default Counter;
