import {autodetectComponentExports} from "../src/autodetectVisitor";

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

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

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
      {
        isDefaultExport: true,
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
export var One = () => <div />;
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "One", isDefaultExport: false, source: "<div />;"}],
    errors: [],
  });
});

test("gets component imports for 'export let'", () => {
  const contents = `
export let One = () => <div />;
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "One", isDefaultExport: false, source: "<div />;"}],
    errors: [],
  });
});

test("gets component imports for js file", () => {
  const contents = `
export var One = () => <div />;
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.js",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.js",
    fileExports: [{name: "One", isDefaultExport: false, source: "<div />;"}],
    errors: [],
  });
});

test("gets component from function", () => {
  const contents = `
export function One() { return <div />; }
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

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

test("gets component from export default function", () => {
  const contents = `
export default function () { return <div />; }
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        isDefaultExport: true,
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
export const One = () => <div />;

export const Two = () => <div />;
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {name: "One", isDefaultExport: false, source: "<div />;"},
      {name: "Two", isDefaultExport: false, source: "<div />;"},
    ],
    errors: [],
  });
});

test("gets component imports for single named export in index.ts file", () => {
  const contents = `
export const One = () => <div />;
`.trim();

  const componentImport = autodetectComponentExports(
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
export default () => <div />;
`.trim();

  const componentImport = autodetectComponentExports(
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
export default () => <div />;
`.trim();

  const componentImport = autodetectComponentExports(
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
export const O______ne = () => <div />;
`.trim();

  const componentImport = autodetectComponentExports(
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
export const One111 = () => <div />;
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "One111", isDefaultExport: false, source: "<div />;"}],
    errors: [],
  });
});

test("component name is capitalized when directory name is not", () => {
  const contents = `
// @snoopy
export default () => <div />;
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{isDefaultExport: true, source: "<div />;"}],
    errors: [],
  });
});

test("gets component import from class component", () => {
  const contents = `
export class Button extends React.Component {}
`.trim();

  const componentImport = autodetectComponentExports(
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

test("gets component import from export default class component", () => {
  const contents = `
export default class Button extends React.Component {}
  `.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file/index.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [
      {
        isDefaultExport: true,
        source: "class Button extends React.Component {}",
      },
    ],
    errors: [],
  });
});

test("gets component imports for named exports as", () => {
  const contents = `
const Foo = () => <div />;
const Bar = () => <div />;

export { Foo as One, Bar }
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {name: "One", isDefaultExport: false, source: "<div />;"},
      {name: "Bar", isDefaultExport: false, source: "<div />;"},
    ],
    errors: [],
  });
});

test("gets component imports for longer arrow statements", () => {
  const contents = `
export const One = () => {
  const a = 1;
  return <div />;
};
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: `{
  const a = 1;
  return <div />;
}`,
      },
    ],
    errors: [],
  });
});

test("gets component imports for longer functions", () => {
  const contents = `
export function One() {
  const a = 1;
  return <div />;
};
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: `{
  const a = 1;
  return <div />;
}`,
      },
    ],
    errors: [],
  });
});

test("gets component imports when component is declared before return statement", () => {
  const contents = `
export const One = () => {
  const Comp = <div />;
  return Comp;
};
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: `{
  const Comp = <div />;
  return Comp;
}`,
      },
    ],
    errors: [],
  });
});

test("gets component imports when component is returned from all conditionals", () => {
  const contents = `
export const One = x => {
  if (x) {
    return <div>Foo</div>;
  } else {
    return <div>Bar</div>;
  }
};
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: `{
  if (x) {
    return <div>Foo</div>;
  } else {
    return <div>Bar</div>;
  }
}`,
      },
    ],
    errors: [],
  });
});

test("gets component imports when component is returned from if branch", () => {
  const contents = `
export const One = x => {
  if (x) {
    return <div>Foo</div>;
  }
};
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: `{
  if (x) {
    return <div>Foo</div>;
  }
}`,
      },
    ],
    errors: [],
  });
});

test("gets component imports when component is returned from else branch", () => {
  const contents = `
export const One = x => {
  if (x) {
    const a = 1;
  } else {
    return <div>Foo</div>;
  }
};
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: `{
  if (x) {
    const a = 1;
  } else {
    return <div>Foo</div>;
  }
}`,
      },
    ],
    errors: [],
  });
});

test("gets component imports when component is returned from one branch, but null from another", () => {
  const contents = `
export const One = x => {
  if (x) {
    return <div>Foo</div>;
  }

  return null;
};
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: `{
  if (x) {
    return <div>Foo</div>;
  }

  return null;
}`,
      },
    ],
    errors: [],
  });
});

test("gets component imports when component is returned from one branch, but undefined from another", () => {
  const contents = `
export const One = x => {
  if (x) {
    return undefined;
  }

  return <div>Foo</div>;
};
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: `{
  if (x) {
    return undefined;
  }

  return <div>Foo</div>;
}`,
      },
    ],
    errors: [],
  });
});

test("handles '<var> as <type>' syntax", () => {
  const contents = `
export function One() {
  const a = 1 as number;
  return <div />;
};
`.trim();

  const componentImport = autodetectComponentExports(
    contents,
    "/path/to/file.ts",
  );

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: `{
  const a = 1;
  return <div />;
}`,
      },
    ],
    errors: [],
  });
});
