// tslint:disable:no-submodule-imports
import * as parserBabylon from "prettier/parser-babylon";
import * as prettier from "prettier/standalone";
// tslint:enable

export const format = (code: string): string =>
  prettier
    .format(code, {
      trailingComma: "all",
      singleQuote: false,
      parser: "babel",
      plugins: [parserBabylon],
    })
    .trim();
