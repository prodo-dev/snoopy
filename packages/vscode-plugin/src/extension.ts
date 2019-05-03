import * as vscode from "vscode";

// const languages = [
//   "javascript",
//   "javascriptreact",
//   "typescript",
//   "typescriptreact",
// ];

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "snoopy.extension.test",
      // tslint:disable-next-line:no-console
      () => console.log("foo"),
    ),
  );
}

export function deactivate() {
  // tslint:disable-next-line:no-console
  console.log("Done");
}
