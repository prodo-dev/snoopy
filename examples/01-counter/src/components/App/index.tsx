import * as React from "react";
import Counter from "../Counter";
import Decrement from "../Decrement";
import Increment from "../Increment";

import "./index.css";

// @prodo
export const App = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div className="app">
      <Decrement setCount={setCount} />
      <Counter count={count} />
      <Increment setCount={setCount} />
    </div>
  );
};

export default App;
