import {findComponentImports} from "@prodo/snoopy-component-search";

const flat = Array.prototype.concat.bind([]);

export const generateComponentsFileContents = async (
  clientDir: string,
): Promise<string> => {
  const componentImports = await findComponentImports(clientDir, process.cwd());

  const importString = flat(
    componentImports.map(({filepath, componentExports}) =>
      componentExports.map(({name, defaultExport}) => {
        const importName = defaultExport ? name : `{ ${name} }`;
        return `import ${importName} from "${filepath}";`;
      }),
    ),
  ).join("\n");

  const componentsArrayString = componentImports
    .map(({componentExports}) =>
      componentExports
        .map(({name}) => `{name: "${name}", component: ${name}}`)
        .join(","),
    )
    .join(",\n  ");

  return `
${importString};

export const components = [
  ${componentsArrayString}
];
`.trimLeft();
};
