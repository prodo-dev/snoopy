import {transform} from "@babel/core";
import pluginSyntaxTypescript from "@babel/plugin-syntax-typescript";
import pluginTransformReactJsx from "@babel/plugin-transform-react-jsx";
import {NodePath} from "@babel/traverse";
import * as t from "@babel/types";
import * as path from "path";
import {Declarations, File, FileError, FileExport, VisitorState} from "./types";
import {
  getExportNames,
  getSourceForClassDecl,
  getSourceForDefaultExport,
  getSourceForFunctionDecl,
  getSourceForVariableDecl,
} from "./utils/visitor";

const isReactElement = (node: t.Node) => {
  if (t.isCallExpression(node) && t.isMemberExpression(node.callee)) {
    const object: t.Expression = node.callee.object;
    return (
      t.isIdentifier(object) &&
      object.name === "React" &&
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
  if (t.isVariableDeclaration(node)) {
    const declarator: t.VariableDeclarator = node.declarations[0];
    const name: string = t.isIdentifier(declarator.id)
      ? declarator.id.name
      : "";
    const target: t.Expression | null = declarator.init;
    const elem = t.isArrowFunctionExpression(target) ? target.body : target;
    return name && target && elem && returnsReactElement(elem);
  } else {
    return returnsReactElement(node.body);
  }
};

const declarationDetection = (declarations: Declarations) => () => ({
  visitor: {
    VariableDeclaration(nodePath: NodePath<t.VariableDeclaration>) {
      const declarator: t.VariableDeclarator = nodePath.node.declarations[0];
      const name = t.isIdentifier(declarator.id) && declarator.id.name;
      if (name) {
        declarations[name] = getSourceForVariableDecl(nodePath.node);
      }
    },
    ExportDefaultDeclaration(nodePath: NodePath<t.ExportDefaultDeclaration>) {
      const declaration = nodePath.node.declaration;
      if (!t.isIdentifier(declaration)) {
        declarations.default = getSourceForDefaultExport(nodePath.node);
      }
    },
    FunctionDeclaration(nodePath: NodePath<t.FunctionDeclaration>) {
      const name = t.isIdentifier(nodePath.node.id) && nodePath.node.id.name;
      if (name) {
        declarations[name] = getSourceForFunctionDecl(nodePath.node);
      }
    },
    ClassDeclaration(nodePath: NodePath<t.ClassDeclaration>) {
      const name = t.isIdentifier(nodePath.node.id) && nodePath.node.id.name;
      if (name) {
        declarations[name] = getSourceForClassDecl(nodePath.node);
      }
    },
  },
});

const exportDetection = (
  state: VisitorState,
  declarations: Declarations,
) => () => ({
  visitor: {
    ExportNamedDeclaration(nodePath: NodePath<t.ExportNamedDeclaration>) {
      const exportNames = getExportNames(nodePath.node);
      const declaration = nodePath.node.declaration;
      if (
        t.isVariableDeclaration(declaration) &&
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
      if (declaresReactElement(nodePath.node)) {
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
      path.extname(filepath) === ".tsx"
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
