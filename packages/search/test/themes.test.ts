import {getThemesFile} from "../src/themes";
import {FileError} from "../src/types";

test("gets theme imports for single named export", () => {
  const contents = `
  // @prodo:theme
  export const pinkTheme = {}
`.trim();

  const themeImport = getThemesFile(contents, "/path/to/file.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "pinkTheme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets component imports for 'export var'", () => {
  const contents = `
// @prodo:theme
export var pinkTheme = {}
`.trim();

  const componentImport = getThemesFile(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "pinkTheme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets component imports for 'export let'", () => {
  const contents = `
// @prodo:theme
export let pinkTheme = {}
`.trim();

  const componentImport = getThemesFile(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "pinkTheme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets theme imports for multiple named exports", () => {
  const contents = `
// @prodo:theme
export const pinkTheme = {}

export const greenTheme = {}

// @prodo:theme
export const darkTheme = {}
`.trim();

  const themeImport = getThemesFile(contents, "/path/to/file.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [
      {name: "pinkTheme", isDefaultExport: false},
      {name: "darkTheme", isDefaultExport: false},
    ],
    errors: [],
  });
});

test("gets theme imports for single named export in index.ts file", () => {
  const contents = `
// @prodo:theme
export const pinkTheme = {}
`.trim();

  const themeImport = getThemesFile(contents, "/path/to/file/index.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "pinkTheme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets theme imports for a predeclared export", () => {
  const contents = `
const pinkTheme = {}

// @prodo:theme
export pinkTheme;
`.trim();

  const themeImport = getThemesFile(contents, "/path/to/file.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "pinkTheme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets theme imports for default export", () => {
  const contents = `
// @prodo:theme
export default {
    colors: {
      bg: "#662a48",
      fg: "#4c1f36",
    },
  }
`.trim();

  const themeImport = getThemesFile(contents, "/path/to/file/pinkTheme.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/pinkTheme.ts",
    fileExports: [{isDefaultExport: true}],
    errors: [],
  });
});

test("gets theme imports for default export in index.ts file", () => {
  const contents = `
// @prodo:theme
export default {}
`.trim();

  const themeImport = getThemesFile(
    contents,
    "/path/to/file/pinkTheme/index.ts",
  );

  expect(themeImport).toEqual({
    filepath: "/path/to/file/pinkTheme/index.ts",
    fileExports: [{isDefaultExport: true}],
    errors: [],
  });
});

test("gets theme imports with an underscore in the name", () => {
  const contents = `
// @prodo:theme
export const pink_theme = {}
`.trim();

  const themeImport = getThemesFile(contents, "/path/to/file/index.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "pink_theme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets theme imports with a number in the name", () => {
  const contents = `
// @prodo:theme
export const pink1Theme1 = {}
`.trim();

  const themeImport = getThemesFile(contents, "/path/to/file/index.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "pink1Theme1", isDefaultExport: false}],
    errors: [],
  });
});

test("catch error when prodo theme comment is on non-export", () => {
  const contents = `
// @prodo:theme
const foo = "bar"
`.trim();

  const themeImport = getThemesFile(contents, "/path/to/file/index.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [],
    errors: [
      new FileError(
        "/path/to/file/index.ts",
        "The `@prodo:theme` tag must be directly above an exported theme.",
      ),
    ],
  });
});

test("gets theme with various types of prodo comments", () => {
  const contents = `
// @prodo:theme
export const pinkTheme = {}

//@prodo:theme
export const greenTheme = {}

//    @prodo:theme
export const darkTheme = {}

    //  @prodo:theme
export const lightTheme = {}

//  @prodobot
export const otherTheme = {}
`.trim();

  const themeImport = getThemesFile(contents, "/path/to/file/index.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [
      {name: "pinkTheme", isDefaultExport: false},
      {name: "greenTheme", isDefaultExport: false},
      {name: "darkTheme", isDefaultExport: false},
    ],
    errors: [],
  });
});
