import * as React from "react";

import Counter from "./Counter";
import Decrement from "./Decrement";
import Increment from "./Increment";

export default () => {
  const [count, setCount] = React.useState(0);
  return (
    <div className="app">
      <Decrement setCount={setCount} />
      <Counter count={count} />
      <Increment setCount={setCount} />
    </div>
  );
};
