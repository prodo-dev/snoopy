import * as path from "path";

interface Alias {
  regex: RegExp;
  getNewFilename: (oldFilename: string, parent: string) => string;
}

const aliases: Alias[] = [
  {
    regex: /^styled-components$/,
    getNewFilename: (_: string, parent: string) =>
      path.relative(path.dirname(parent), require.resolve("styled-components")),
  },
];

export default (bundler: any) => {
  const resolver = bundler.resolver;
  const originalResolve = resolver.resolve;

  // Patching
  // https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/Resolver.js#L32
  resolver.resolve = async (input: string, parent: string) => {
    let filename = input;

    for (const {regex, getNewFilename} of aliases) {
      if (regex.test(filename)) {
        filename = getNewFilename(filename, parent);
        break;
      }
    }

    return originalResolve.call(resolver, filename, parent);
  };
};
