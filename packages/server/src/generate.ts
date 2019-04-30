import {findImports} from "@prodo/snoopy-search";

const flat = Array.prototype.concat.bind([]);

export const generateComponentsFileContents = async (
  clientDir: string,
): Promise<string> => {
  const imports = await findImports(clientDir, process.cwd());

  const importString = flat(
    imports.components.concat(imports.themes).map(({filepath, fileExports}) =>
      fileExports.map(({name, defaultExport}) => {
        const importName = defaultExport ? name : `{ ${name} }`;
        return `import ${importName} from "${filepath}";`;
      }),
    ),
  ).join("\n");

  const componentsArrayString = imports.components
    .map(({fileExports}) =>
      fileExports
        .map(({name}) => `{name: "${name}", component: ${name}}`)
        .join(","),
    )
    .join(",\n  ");

  const themesArrayString = imports.themes
    .map(({fileExports}) =>
      fileExports
        .map(({name}) => `{name: "${name}", theme: ${name}}`)
        .join(","),
    )
    .join(",\n  ");

  return `
${importString};

export const components = [
  ${componentsArrayString}
];

export const themes = [
  ${themesArrayString}
];
`.trimLeft();
};
