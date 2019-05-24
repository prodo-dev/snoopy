import {detectAndFindComponentExports} from "../src";

test("doesn't duplicate exports with annotations", () => {
  const code = `
// @snoopy
export const One = () => <div />;
`;
  const result = detectAndFindComponentExports(code, "/path/to/file.ts");

  expect(result).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: "<div />;",
      },
    ],
    errors: [],
  });
});

test("doesn't duplicate default exports with annotations", () => {
  const code = `
const One = () => <div />;

// @snoopy
export default One;
`;
  const result = detectAndFindComponentExports(code, "A/path/to/file.ts");

  expect(result).toEqual({
    filepath: "A/path/to/file.ts",
    fileExports: [
      {
        isDefaultExport: true,
        source: "<div />;",
      },
    ],
    errors: [],
  });
});

test("ignores exported components with ignore annotation", () => {
  const code = `
export const One = () => <div />;

// @snoopy
export const Two = () => <div />;

// @snoopy:ignore
export const Three = () => <div />;
`;
  const result = detectAndFindComponentExports(code, "/path/to/file.ts");

  expect(result).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: "<div />;",
      },
      {
        name: "Two",
        isDefaultExport: false,
        source: "<div />;",
      },
    ],
    errors: [],
  });
});

test("ignores exported default components with ignore annotation", () => {
  const code = `
export const One = () => <div />;

// @snoopy
export const Two = () => <div />;

const Three = () => <div />;

// @snoopy:ignore
export default Three;
`;
  const result = detectAndFindComponentExports(code, "/path/to/file.ts");

  expect(result).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {
        name: "One",
        isDefaultExport: false,
        source: "<div />;",
      },
      {
        name: "Two",
        isDefaultExport: false,
        source: "<div />;",
      },
    ],
    errors: [],
  });
});
