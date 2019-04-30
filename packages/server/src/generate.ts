import {searchCodebase} from "@prodo/snoopy-search";

const flat = Array.prototype.concat.bind([]);

export const generateComponentsFileContents = async (
  clientDir: string,
): Promise<string> => {
  const imports = await searchCodebase(clientDir, process.cwd());

  const importString = flat(
    imports.componentFiles
      .concat(imports.themeFiles)
      .map(({filepath, fileExports}) =>
        fileExports.map(({name, isDefaultExport}) => {
          const importName = isDefaultExport ? name : `{ ${name} }`;
          return `import ${importName} from "${filepath}";`;
        }),
      ),
  ).join("\n");

  const componentsArrayString = imports.componentFiles
    .map(({fileExports}) =>
      fileExports
        .map(({name}) => `{name: "${name}", component: ${name}}`)
        .join(","),
    )
    .join(",\n  ");

  const themesArrayString = imports.themeFiles
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
