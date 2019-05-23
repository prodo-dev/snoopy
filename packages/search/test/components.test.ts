import {findComponentExports} from "../src/annotations";
import {FileError} from "../src/types";

test("gets component imports for single named export", () => {
  const contents = `
import * as React from "react";
import Counter from "../Counter";
import Decrement from "../Decrement";
import Increment from "../Increment";

import "./index.css";

// @snoopy
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
    fileExports: [
      {
        name: "App",
        isDefaultExport: false,
        source: `
{
  const [count, setCount] = React.useState(0);
  return (
    <div className="app">
      <Decrement setCount={setCount} />
      <Counter count={count} />
      <Increment setCount={setCount} />
    </div>
  );
}
`.trim(),
      },
    ],
    errors: [],
  });
});

test("gets component imports for 'export var'", () => {
  const contents = `
// @snoopy
export var One = () => <div />;
`.trim();

  const componentImport = findComponentExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "One", isDefaultExport: false, source: "<div />;"}],
    errors: [],
  });
});

test("gets component imports for 'export let'", () => {
  const contents = `
// @snoopy
export let One = () => <div />;
`.trim();

  const componentImport = findComponentExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "One", isDefaultExport: false, source: "<div />;"}],
    errors: [],
  });
});

test("gets component from function", () => {
  const contents = `
// @snoopy
export function One() { return <div />; }
`.trim();

  const componentImport = findComponentExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: `{
  return <div />;
}`,
      },
    ],
    errors: [],
  });
});

test("gets component imports for multiple named exports", () => {
  const contents = `
// @snoopy
export const One = () => <div />;

export const Two = () => <div />;

// @snoopy
export const Three = () => <div />;
`.trim();

  const componentImport = findComponentExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {name: "One", isDefaultExport: false, source: "<div />;"},
      {name: "Three", isDefaultExport: false, source: "<div />;"},
    ],
    errors: [],
  });
});

test("gets component imports for single named export in index.ts file", () => {
  const contents = `
// @snoopy
export const One = () => <div />;
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "One", isDefaultExport: false, source: "<div />;"}],
    errors: [],
  });
});

test("gets component imports for default export", () => {
  const contents = `
// @snoopy
export default () => <div />;
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/Button.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/Button.ts",
    fileExports: [{isDefaultExport: true, source: "<div />;"}],
    errors: [],
  });
});

test("gets component imports for default export in index.ts file", () => {
  const contents = `
// @snoopy
export default () => <div />;
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/Button/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/Button/index.ts",
    fileExports: [{isDefaultExport: true, source: "<div />;"}],
    errors: [],
  });
});

test("gets component imports with an underscore in the name", () => {
  const contents = `
// @snoopy
export const O______ne = () => <div />;
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [
      {name: "O______ne", isDefaultExport: false, source: "<div />;"},
    ],
    errors: [],
  });
});

test("gets component imports with a number in the name", () => {
  const contents = `
// @snoopy
export const One111 = () => <div />;
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "One111", isDefaultExport: false, source: "<div />;"}],
    errors: [],
  });
});

test("catch error when snoopy comment is on non-export", () => {
  const contents = `
// @snoopy
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
        "The `@snoopy` tag must be directly above an exported React component.",
      ),
    ],
  });
});

test("gets component with various types of snoopy comments", () => {
  const contents = `
// @snoopy
export const One = () => <div />;

//@snoopy
export const Two = () => <div />;

//     @snoopy
export const Three = () => <div />;

    // @snoopy
export const Four = () => <div />;

// @snoopybot
export const Five = () => <div />;
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [
      {name: "One", isDefaultExport: false, source: "<div />;"},
      {name: "Two", isDefaultExport: false, source: "<div />;"},
      {name: "Three", isDefaultExport: false, source: "<div />;"},
      {name: "Four", isDefaultExport: false, source: "<div />;"},
    ],
    errors: [],
  });
});

test("component name is capitalized when directory name is not", () => {
  const contents = `
// @snoopy
export default () => <div />;
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{isDefaultExport: true, source: "<div />;"}],
    errors: [],
  });
});

test("gets component name from class component", () => {
  const contents = `
// @snoopy
export class Button extends React.Component {}
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [
      {
        name: "Button",
        isDefaultExport: false,
        source: "class Button extends React.Component {}",
      },
    ],
    errors: [],
  });
});

test("doesn't match themes", () => {
  const contents = `
// @snoopy
export const Button = () => <div />;

// @snoopy:theme
export const Theme = () => <div />;
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "Button", isDefaultExport: false, source: "<div />;"}],
    errors: [],
  });
});

test("doesn't match comment in string", () => {
  const contents = `
const s = \`
  // @snoopy
  export const Hello = () => <div />;
\`
`.trim();

  const componentImport = findComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toBe(null);
});

test("gets component imports for named exports as", () => {
  const contents = `
const Foo = () => <div />;
const Bar = () => <div />;

// @snoopy
export { Foo as One, Bar }
`.trim();

  const componentImport = findComponentExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {name: "One", isDefaultExport: false, source: undefined},
      {name: "Bar", isDefaultExport: false, source: undefined},
    ],
    errors: [],
  });
});
