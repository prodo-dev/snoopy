import {getComponentImportsForFile} from "../src";

test("gets component imports for single named export", () => {
  const contents = `
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
`.trim();

  const componentImport = getComponentImportsForFile(
    "/cwd",
    contents,
    "/path/to/file",
  );

  expect(componentImport).toEqual({
    filepath: "../path/to/file",
    exportNames: ["App"],
  });
});

test("gets component imports for multiple named exports", () => {
  const contents = `
// @prodo
export const One = () => {};

export const Two = () => {};

// @prodo
export const Three = () => {};
`.trim();

  const componentImport = getComponentImportsForFile(
    "/cwd",
    contents,
    "/path/to/file",
  );

  expect(componentImport).toEqual({
    filepath: "../path/to/file",
    exportNames: ["One", "Three"],
  });
});
