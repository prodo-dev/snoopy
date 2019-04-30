import {findImports} from "@prodo/snoopy-search";

const flat = Array.prototype.concat.bind([]);

export const generateComponentsFileContents = async (
  clientDir: string,
): Promise<string> => {
  const imports = await findImports(clientDir, process.cwd());
  console.log(imports);

  const importString = flat(
    imports.components.map(({filepath, exports}) =>
      exports.map(({name, defaultExport}) => {
        const importName = defaultExport ? name : `{ ${name} }`;
        return `import ${importName} from "${filepath}";`;
      }),
    ),
  ).join("\n");

  // TODO clean this up
  const themesImportString = imports.themes
    .map(({filepath, exports}) =>
      exports
        .map(({name, defaultExport}) => {
          const importName = defaultExport ? name : `{ ${name} }`;
          return `import ${importName} from "${filepath}";`;
        })
        .join("\n"),
    )
    .join("\n");
  console.log(themesImportString);

  // TODO fix name clash
  const componentsArrayString = imports.components
    .map(({exports}) =>
      exports
        .map(({name}) => `{name: "${name}", component: ${name}}`)
        .join(","),
    )
    .join(",\n  ");

  const themesArrayString = imports.themes
    .map(({exports}) =>
      exports.map(({name}) => `{name: "${name}", theme: ${name}}`).join(","),
    )
    .join(",\n  ");

  return `
${importString};

${themesImportString};

export const components = [
  ${componentsArrayString}
];

export const themes = [
  ${themesArrayString}
];
`.trimLeft();
};
