import {findComponentExports} from "../src/parser";
import {FileError} from "../src/types";

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

  const componentImport = findComponentExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "App", isDefaultExport: false}],
    errors: [],
  });
});

test("gets component imports for 'export var'", () => {
  const contents = `
// @prodo
export var One = () => {};
`.trim();

  const componentImport = findComponentExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "One", isDefaultExport: false}],
    errors: [],
  });
});

test("gets component imports for 'export let'", () => {
  const contents = `
// @prodo
export let One = () => {};
`.trim();

  const componentImport = findComponentExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "One", isDefaultExport: false}],
    errors: [],
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

  const componentImport = findComponentExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {name: "One", isDefaultExport: false},
      {name: "Three", isDefaultExport: false},
    ],
    errors: [],
  });
});

test("gets component imports for single named export in index.ts file", () => {
  const contents = `
// @prodo
export const One = () => {};
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "One", isDefaultExport: false}],
    errors: [],
  });
});

test("gets component imports for default export", () => {
  const contents = `
// @prodo
export default () => {};
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/Button.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/Button.ts",
    fileExports: [{isDefaultExport: true}],
    errors: [],
  });
});

test("gets component imports for default export in index.ts file", () => {
  const contents = `
// @prodo
export default () => {};
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/Button/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/Button/index.ts",
    fileExports: [{isDefaultExport: true}],
    errors: [],
  });
});

test("gets component imports with an underscore in the name", () => {
  const contents = `
// @prodo
export const O______ne = () => {};
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "O______ne", isDefaultExport: false}],
    errors: [],
  });
});

test("gets component imports with a number in the name", () => {
  const contents = `
// @prodo
export const One111 = () => {};
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "One111", isDefaultExport: false}],
    errors: [],
  });
});

test("catch error when prodo comment is on non-export", () => {
  const contents = `
// @prodo
const foo = "bar"
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [],
    errors: [
      new FileError(
        "/path/to/file/index.ts",
        "The `@prodo` tag must be directly above an exported React component.",
      ),
    ],
  });
});

test("gets component with various types of prodo comments", () => {
  const contents = `
// @prodo
export const One = () => {};

//@prodo
export const Two = () => {};

//     @prodo
export const Three = () => {};

    // @prodo
export const Four = () => {};

// @prodobot
export const Five = () => {};
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [
      {name: "One", isDefaultExport: false},
      {name: "Two", isDefaultExport: false},
      {name: "Three", isDefaultExport: false},
      {name: "Four", isDefaultExport: false},
    ],
    errors: [],
  });
});

test("component name is capitalized when directory name is not", () => {
  const contents = `
// @prodo
export default () => {};
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{isDefaultExport: true}],
    errors: [],
  });
});

test("gets component name from class component", () => {
  const contents = `
// @prodo
export class Button extends React.Component {}
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "Button", isDefaultExport: false}],
    errors: [],
  });
});

test("doesn't match themes", () => {
  const contents = `
// @prodo
export const Button = () => {};

// @prodo:theme
export const Theme = () => {};
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "Button", isDefaultExport: false}],
    errors: [],
  });
});

test("doesn't match comment in string", () => {
  const contents = `
const s = \`
  // @prodo
  export const Hello = () => {};
\`
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toBe(null);
});
