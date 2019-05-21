import {transform} from "@babel/core";
import pluginSyntaxTypescript from "@babel/plugin-syntax-typescript";
import pluginTransformReactJsx from "@babel/plugin-transform-react-jsx";
import {NodePath} from "@babel/traverse";
import * as t from "@babel/types";
import * as path from "path";
import {format} from "./format";
import {
  DeclarationSources,
  File,
  FileError,
  FileExport,
  VisitorState,
} from "./types";
import {
  getExportNames,
  getSourceForClassDecl,
  getSourceForDefaultExport,
  getSourceForFunctionDecl,
  getSourceForVariableDecl,
} from "./utils/visitor";

const isReactElement = (node: t.Node) => {
  if (t.isCallExpression(node) && t.isMemberExpression(node.callee)) {
    const calleeObject: t.Expression = node.callee.object;
    return (
      t.isIdentifier(calleeObject) &&
      calleeObject.name === "React" &&
      node.callee.property.name === "createElement"
    );
  }
  return false;
};

const returnsReactElement = (node: t.Node): boolean => {
  if (isReactElement(node)) {
    return true;
  } else if (t.isBlockStatement(node)) {
    const lastStatement = node.body[node.body.length - 1];
    if (t.isReturnStatement(lastStatement) && lastStatement.argument) {
      return isReactElement(lastStatement.argument);
    }
  }
  return false;
};

const declaresReactElement = (
  node: t.VariableDeclaration | t.FunctionDeclaration | t.ClassDeclaration,
) => {
  if (t.isVariableDeclaration(node) && node.declarations.length > 0) {
    const declarator: t.VariableDeclarator = node.declarations[0];
    const name = t.isIdentifier(declarator.id) && declarator.id.name;
    if (name) {
      const target: t.Expression | null = declarator.init;
      const elem = t.isArrowFunctionExpression(target) ? target.body : target;
      return target && elem && returnsReactElement(elem);
    }
  } else if (t.isFunctionDeclaration(node)) {
    return returnsReactElement(node.body);
  } else if (
    t.isClassDeclaration(node) &&
    t.isMemberExpression(node.superClass)
  ) {
    return (
      t.isIdentifier(node.superClass.object) &&
      node.superClass.object.name === "React" &&
      node.superClass.property.name === "Component"
    );
  }
  return false;
};

const declarationDetection = (declarations: DeclarationSources) => () => ({
  visitor: {
    VariableDeclaration(nodePath: NodePath<t.VariableDeclaration>) {
      if (nodePath.node.declarations.length > 0) {
        const declarator: t.VariableDeclarator = nodePath.node.declarations[0];
        const name = t.isIdentifier(declarator.id) && declarator.id.name;
        if (name) {
          declarations[name] = format(
            getSourceForVariableDecl(nodePath.node) || "",
          );
        }
      }
    },
    ExportDefaultDeclaration(nodePath: NodePath<t.ExportDefaultDeclaration>) {
      const declaration = nodePath.node.declaration;
      if (!t.isIdentifier(declaration)) {
        declarations.default = format(
          getSourceForDefaultExport(nodePath.node) || "",
        );
      }
    },
    FunctionDeclaration(nodePath: NodePath<t.FunctionDeclaration>) {
      const name = t.isIdentifier(nodePath.node.id) && nodePath.node.id.name;
      if (name) {
        declarations[name] = format(
          getSourceForFunctionDecl(nodePath.node) || "",
        );
      }
    },
    ClassDeclaration(nodePath: NodePath<t.ClassDeclaration>) {
      const name = t.isIdentifier(nodePath.node.id) && nodePath.node.id.name;
      if (name) {
        declarations[name] = format(getSourceForClassDecl(nodePath.node) || "");
      }
    },
  },
});

const exportDetection = (
  state: VisitorState,
  declarations: DeclarationSources,
) => () => ({
  visitor: {
    ExportNamedDeclaration(nodePath: NodePath<t.ExportNamedDeclaration>) {
      const exportNames = getExportNames(nodePath.node);
      const declaration = nodePath.node.declaration;
      if (
        (t.isVariableDeclaration(declaration) ||
          t.isFunctionDeclaration(declaration) ||
          t.isClassDeclaration(declaration)) &&
        declaresReactElement(declaration)
      ) {
        state.fileExports.push(
          ...exportNames.map(name => {
            const fileExport: FileExport = {
              isDefaultExport: false,
              name,
              source: declarations[name],
            };
            return fileExport;
          }),
        );
      } else if (!declaration && nodePath.node.specifiers) {
        if (nodePath.node.specifiers) {
          const exportNameMappings: {
            [key: string]: string;
          } = nodePath.node.specifiers.reduce(
            (names: {[key: string]: string}, s) => {
              if (t.isExportSpecifier(s)) {
                names[s.exported.name] = s.local.name;
                return names;
              }

              return names;
            },
            {},
          );
          for (const name of Object.keys(exportNameMappings)) {
            if (declarations[exportNameMappings[name]]) {
              const fileExport: FileExport = {
                isDefaultExport: false,
                name,
                source: declarations[exportNameMappings[name]],
              };
              state.fileExports.push(fileExport);
            }
          }
        }
      }
    },
    ExportDefaultDeclaration(nodePath: NodePath<t.ExportDefaultDeclaration>) {
      const declaration = nodePath.node.declaration;
      if (t.isIdentifier(declaration)) {
        if (
          Object.keys(state.detectedComponents!).indexOf(declaration.name) >= 0
        ) {
          state.fileExports.push({
            isDefaultExport: true,
            source: state.detectedComponents![declaration.name],
          });
        }
      } else {
        const target = t.isArrowFunctionExpression(declaration)
          ? declaration.body
          : declaration;
        if (returnsReactElement(target)) {
          state.fileExports.push({
            isDefaultExport: true,
            source: declarations.default,
          });
        }
      }
    },
    VariableDeclaration(nodePath: NodePath<t.VariableDeclaration>) {
      if (
        declaresReactElement(nodePath.node) &&
        nodePath.node.declarations.length
      ) {
        const declarator: t.VariableDeclarator = nodePath.node.declarations[0];
        const name = t.isIdentifier(declarator.id) && declarator.id.name;
        if (name) {
          state.detectedComponents![name] = declarations[name];
        }
      }
    },
    FunctionDeclaration(nodePath: NodePath<t.FunctionDeclaration>) {
      if (declaresReactElement(nodePath.node)) {
        const name = t.isIdentifier(nodePath.node.id) && nodePath.node.id.name;
        if (name) {
          state.detectedComponents![name] = declarations[name];
        }
      }
    },
    ClassDeclaration(nodePath: NodePath<t.ClassDeclaration>) {
      if (declaresReactElement(nodePath.node)) {
        const name = t.isIdentifier(nodePath.node.id) && nodePath.node.id.name;
        if (name) {
          state.detectedComponents![name] = declarations[name];
        }
      }
    },
  },
});

export const autodetectComponentExports = (
  code: string,
  filepath: string,
): File | null => {
  const state: VisitorState = {
    filepath,
    fileExports: [],
    errors: [],
    detectedComponents: {},
  };

  try {
    const plugins =
      path.extname(filepath) === ".tsx" || path.extname(filepath) === ".ts"
        ? [[pluginSyntaxTypescript, {isTSX: true}]]
        : [];
    const declarations = {};
    const transformed = transform(code, {
      sourceType: "module",
      plugins: [
        declarationDetection(declarations),
        ...plugins,
        pluginTransformReactJsx,
      ],
    });
    if (transformed && transformed.code) {
      transform(transformed.code, {
        sourceType: "module",
        plugins: [...plugins, exportDetection(state, declarations)],
      });
    }
  } catch (e) {
    return {
      filepath,
      fileExports: [],
      errors: [new FileError(filepath, `Error processing file: ${e.message}`)],
    };
  }

  if (state.fileExports.length === 0 && state.errors.length === 0) {
    return null;
  }

  return {
    filepath,
    fileExports: state.fileExports,
    errors: state.errors,
  };
};
