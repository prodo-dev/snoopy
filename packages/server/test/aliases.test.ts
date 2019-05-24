import * as path from "path";
import applyAliases from "../src/aliases";

describe("aliases", () => {
  it("correctly resolves path to styled-components", async () => {
    const inputs = {
      [path.resolve(
        "src/components/App/index.tsx",
      )]: "../../../../../node_modules/styled-components/dist/styled-components.cjs.js",
      [path.resolve(
        "src/index.tsx",
      )]: "../../../node_modules/styled-components/dist/styled-components.cjs.js",
    };

    const bundler = {
      resolver: {
        resolve: (filename: string, parent: string) => {
          const expected = inputs[parent];

          expect(filename).toBe(expected);
        },
      },
    };

    applyAliases(bundler);

    return Promise.all(
      Object.keys(inputs).map(parent =>
        bundler.resolver.resolve("styled-components", parent),
      ),
    );
  });
});
