import {findThemeExports} from "../src/annotations";
import {FileError} from "../src/types";

test("gets theme imports for single named export", () => {
  const contents = `
  // @snoopy:theme
  export const pinkTheme = {}
`.trim();

  const themeImport = findThemeExports(contents, "/path/to/file.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "pinkTheme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets component imports for 'export var'", () => {
  const contents = `
// @snoopy:theme
export var pinkTheme = {}
`.trim();

  const componentImport = findThemeExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "pinkTheme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets component imports for 'export let'", () => {
  const contents = `
// @snoopy:theme
export let pinkTheme = {}
`.trim();

  const componentImport = findThemeExports(contents, "/path/to/file.ts");

  expect(componentImport).toEqual({
    filepath: "/path/to/file.ts",
    fileExports: [{name: "pinkTheme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets theme imports for multiple named exports", () => {
  const contents = `
// @snoopy:theme
export const pinkTheme = {}

export const greenTheme = {}

// @snoopy:theme
export const darkTheme = {}
`.trim();

  const themeImport = findThemeExports(contents, "/path/to/file.ts");

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
// @snoopy:theme
export const pinkTheme = {}
`.trim();

  const themeImport = findThemeExports(contents, "/path/to/file/index.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "pinkTheme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets theme imports for default export", () => {
  const contents = `
// @snoopy:theme
export default {
    colors: {
      bg: "#662a48",
      fg: "#4c1f36",
    },
  }
`.trim();

  const themeImport = findThemeExports(contents, "/path/to/file/pinkTheme.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/pinkTheme.ts",
    fileExports: [{isDefaultExport: true}],
    errors: [],
  });
});

test("gets theme imports for default export in index.ts file", () => {
  const contents = `
// @snoopy:theme
export default {}
`.trim();

  const themeImport = findThemeExports(
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
// @snoopy:theme
export const pink_theme = {}
`.trim();

  const themeImport = findThemeExports(contents, "/path/to/file/index.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "pink_theme", isDefaultExport: false}],
    errors: [],
  });
});

test("gets theme imports with a number in the name", () => {
  const contents = `
// @snoopy:theme
export const pink1Theme1 = {}
`.trim();

  const themeImport = findThemeExports(contents, "/path/to/file/index.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [{name: "pink1Theme1", isDefaultExport: false}],
    errors: [],
  });
});

test("catch error when snoopy theme comment is on non-export", () => {
  const contents = `
// @snoopy:theme
const foo = "bar"
`.trim();

  const themeImport = findThemeExports(contents, "/path/to/file/index.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [],
    errors: [
      new FileError(
        "/path/to/file/index.ts",
        "The `@snoopy:theme` tag must be directly above an exported theme.",
      ),
    ],
  });
});

test("gets theme with various types of snoopy comments", () => {
  const contents = `
// @snoopy:theme
export const pinkTheme = {}

//@snoopy:theme
export const greenTheme = {}

//    @snoopy:theme
export const darkTheme = {}

    //  @snoopy:theme
export const lightTheme = {}

//  @snoopy
export const otherTheme = {}
`.trim();

  const themeImport = findThemeExports(contents, "/path/to/file/index.ts");

  expect(themeImport).toEqual({
    filepath: "/path/to/file/index.ts",
    fileExports: [
      {name: "pinkTheme", isDefaultExport: false},
      {name: "greenTheme", isDefaultExport: false},
      {name: "darkTheme", isDefaultExport: false},
      {name: "lightTheme", isDefaultExport: false},
    ],
    errors: [],
  });
});
