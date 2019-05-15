import {checkMatch} from "../src";

const validPaths = [
  "/src/Modal/index.ts",
  "/src/Components/index.tsx",
  "/src/Hello/index.js",
  "/src/Button/index.jsx",
  "/src/Button.ts",
  "/src/Hello.tsx",
  "/a/really/really/deep/path/Components.js",
  "src/Modal.jsx",
];

const invalidPaths = [
  "node_modules/Hello.tsx",
  ".hidden.tsx",
  "directory/.hidden.tsx",
  "flycheck_index.tsx",
  "directory/flycheck_index.tsx",
];

for (const path of validPaths) {
  test(`matches valid file path: ${path}`, () => {
    expect(checkMatch(path)).toBe(true);
  });
}

for (const path of invalidPaths) {
  test(`does not match invalid file path: ${path}`, () => {
    expect(checkMatch(path)).toBe(false);
  });
}
