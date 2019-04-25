import * as React from "react";

import "./index.css";

// @prodo
export const Counter = ({count}: {count: number}) => (
  <p className="counter">{count}</p>
);

Counter.examples = [
  {name: "Count is 0", jsx: <Counter count={0} />},
  {name: "Count is 10", jsx: <Counter count={10} />},
];

export default Counter;
