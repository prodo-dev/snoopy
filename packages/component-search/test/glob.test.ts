import {checkMatch} from "../src";

test("matches valid filepaths", () => {
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

  validPaths.forEach(p => {
    expect(`${p}: ${checkMatch(p)}`).toBe(`${p}: true`);
  });
});

test("does not match invalid filepaths", () => {
  const inValidPaths = [".env.tsx", "flycheck_index.tsx"];

  inValidPaths.forEach(p => {
    expect(`${p}: ${checkMatch(p)}`).toBe(`${p}: false`);
  });
});
