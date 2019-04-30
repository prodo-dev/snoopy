import {getThemeImportsForFile} from "../src/themes";
import {FileError} from "../src/types";

test("gets theme imports for single named export", () => {
  const contents = `
  // @prodo:theme
  export const pinkTheme = {
    colors: {
      bg: "#662a48",
      fg: "#4c1f36",
    },
    fonts: {
      text: "'Ubuntu', sans-serif",
      code: "Ubuntu, mononspace",
    },
  };
`.trim();

  const themeImport = getThemeImportsForFile(
    "/cwd",
    contents,
    "/path/to/file.ts",
  );

  expect(themeImport).toEqual({
    filepath: "../path/to/file.ts",
    fileExports: [{name: "pinkTheme", defaultExport: false}],
    errors: [],
  });
});

test("gets theme imports for multiple named exports", () => {
  const contents = `
// @prodo:theme
export const pinkTheme = {
  colors: {
    bg: "#662a48",
    fg: "#4c1f36",
  },
  fonts: {
    text: "'Ubuntu', sans-serif",
    code: "Ubuntu, mononspace",
  },
};

export const greenTheme = {
  colors: {
    bg: "#043b25",
    fg: "#032a1a",
  },
  fonts: {
    text: "'Ubuntu', sans-serif",
    code: "Ubuntu, mononspace",
  },
};

// @prodo:theme
export const darkTheme = {
  colors: {
    bg: "#282c34",
    fg: "#31353f",
  },
  fonts: {
    text: "'Ubuntu', sans-serif",
    code: "Ubuntu, mononspace",
  },
};
`.trim();

  const themeImport = getThemeImportsForFile(
    "/cwd",
    contents,
    "/path/to/file.ts",
  );

  expect(themeImport).toEqual({
    filepath: "../path/to/file.ts",
    fileExports: [
      {name: "pinkTheme", defaultExport: false},
      {name: "darkTheme", defaultExport: false},
    ],
    errors: [],
  });
});

test("gets theme imports for single named export in index.ts file", () => {
  const contents = `
// @prodo:theme
export const pinkTheme = {
  colors: {
    bg: "#662a48",
    fg: "#4c1f36",
  },
}
`.trim();

  const themeImport = getThemeImportsForFile(
    "/cwd",
    contents,
    "/path/to/file/index.ts",
  );

  expect(themeImport).toEqual({
    filepath: "../path/to/file",
    fileExports: [{name: "pinkTheme", defaultExport: false}],
    errors: [],
  });
});

test("gets theme imports for a predeclared export", () => {
  const contents = `
const pinkTheme = {
    colors: {
      bg: "#662a48",
      fg: "#4c1f36",
    },
  }

// @prodo:theme
export pinkTheme;
`.trim();

  const themeImport = getThemeImportsForFile(
    "/cwd",
    contents,
    "/path/to/file.ts",
  );

  expect(themeImport).toEqual({
    filepath: "../path/to/file.ts",
    fileExports: [{name: "pinkTheme", defaultExport: false}],
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

  const themeImport = getThemeImportsForFile(
    "/cwd",
    contents,
    "/path/to/file/pinkTheme.ts",
  );

  expect(themeImport).toEqual({
    filepath: "../path/to/file/pinkTheme.ts",
    fileExports: [{name: "pinkTheme", defaultExport: true}],
    errors: [],
  });
});

test("gets theme imports for default export in index.ts file", () => {
  const contents = `
// @prodo:theme
export default {
    colors: {
      bg: "#662a48",
      fg: "#4c1f36",
    },
  }
`.trim();

  const themeImport = getThemeImportsForFile(
    "/cwd",
    contents,
    "/path/to/file/pinkTheme/index.ts",
  );

  expect(themeImport).toEqual({
    filepath: "../path/to/file/pinkTheme",
    fileExports: [{name: "pinkTheme", defaultExport: true}],
    errors: [],
  });
});

test("gets theme imports with an underscore in the name", () => {
  const contents = `
// @prodo:theme
export const pink_theme = {
  colors: {
    bg: "#662a48",
    fg: "#4c1f36",
  },
}
`.trim();

  const themeImport = getThemeImportsForFile(
    "/cwd",
    contents,
    "/path/to/file/index.ts",
  );

  expect(themeImport).toEqual({
    filepath: "../path/to/file",
    fileExports: [{name: "pink_theme", defaultExport: false}],
    errors: [],
  });
});

test("gets theme imports with a number in the name", () => {
  const contents = `
// @prodo:theme
export const pink1Theme1 = {
  colors: {
    bg: "#662a48",
    fg: "#4c1f36",
  },
}
`.trim();

  const themeImport = getThemeImportsForFile(
    "/cwd",
    contents,
    "/path/to/file/index.ts",
  );

  expect(themeImport).toEqual({
    filepath: "../path/to/file",
    fileExports: [{name: "pink1Theme1", defaultExport: false}],
    errors: [],
  });
});

test("catch error when prodo theme comment is on non-export", () => {
  const contents = `
// @prodo:theme
const foo = "bar"
`.trim();

  const themeImport = getThemeImportsForFile(
    "/cwd",
    contents,
    "/path/to/file/index.ts",
  );

  expect(themeImport).toEqual({
    filepath: "../path/to/file",
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
export const pinkTheme = {
  colors: {
    bg: "#662a48",
    fg: "#4c1f36",
  },
};

//@prodo:theme
export const greenTheme = {
  colors: {
    bg: "#043b25",
    fg: "#032a1a",
  },
};

//    @prodo:theme
export const darkTheme = {
  colors: {
    bg: "#282c34",
    fg: "#31353f",
  },
};

    //  @prodo:theme
export const lightTheme = {
  colors: {
    bg: "#31353f",
    fg: "#282c34",
  },
};

//  @prodobot
export const otherTheme = {
  colors: {
    bg: "#eeeeee",
    fg: "#ffffff",
  },
};
`.trim();

  const themeImport = getThemeImportsForFile(
    "/cwd",
    contents,
    "/path/to/file/index.ts",
  );

  expect(themeImport).toEqual({
    filepath: "../path/to/file",
    fileExports: [
      {name: "pinkTheme", defaultExport: false},
      {name: "greenTheme", defaultExport: false},
      {name: "darkTheme", defaultExport: false},
    ],
    errors: [],
  });
});
