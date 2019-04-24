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
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "../path/to/file.ts",
    componentExports: [{name: "App", defaultExport: false}],
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
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "../path/to/file.ts",
    componentExports: [
      {name: "One", defaultExport: false},
      {name: "Three", defaultExport: false},
    ],
  });
});

test("gets component imports for single named export in index.ts file", () => {
  const contents = `
// @prodo
export const One = () => {};
`.trim();

  const componentImport = getComponentImportsForFile(
    "/cwd",
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "../path/to/file",
    componentExports: [{name: "One", defaultExport: false}],
  });
});

test("gets component imports for default export", () => {
  const contents = `
// @prodo
export default () => {};
`.trim();

  const componentImport = getComponentImportsForFile(
    "/cwd",
    contents,
    "/path/to/file/Button.ts",
  );

  expect(componentImport).toEqual({
    filepath: "../path/to/file/Button.ts",
    componentExports: [{name: "Button", defaultExport: true}],
  });
});

test("gets component imports for default export in index.ts file", () => {
  const contents = `
// @prodo
export default () => {};
`.trim();

  const componentImport = getComponentImportsForFile(
    "/cwd",
    contents,
    "/path/to/file/Button/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "../path/to/file/Button",
    componentExports: [{name: "Button", defaultExport: true}],
  });
});
