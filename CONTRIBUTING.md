# Contributing to Snoopy

This doc outlines the architecture of Snoopy and how provides a step-by-step
guide of setting it up on your machine.

## Setup

Snoopy is a [Yarn workspace](https://yarnpkg.com/en/docs/workspaces) that is
composed of several separate packages. These packages are all published to NPM
together with [Lerna](https://github.com/lerna/lerna). First install all
dependencies with:

```
yarn
```

To build Snoopy for development, you need to compile the codebase with
[TypeScript](https://www.typescriptlang.org/). In the root of the project run:

```
yarn build:watch
```

This will watch and incrementally build all packages. If you only want to build
without watching, drop the `:watch`.

## Running on an app

Snoopy itself is useless without an App to run it on. There are several examples
included in the Snoopy codebase, but you can run it on any React project you
want. As an example, we will use the `02-to-do-list` example.

Navigate to the example:

```
cd examples/02-to-do-list
```

Start Snoopy by running node on the entry to the CLI package:

```
node ../../packages/cli/lib/index.js
```

You should see that the server has started on some port (default 3042). You can
navigate to `localhost:PORT` and Snoopy should be running.

## Making changes

When you make a change to any package that is not the UI, make sure that the
`build:watch` command has completed its incremental complication. Otherwise your
changes will not be run. If there are any TypeScript issues and the command
shows an error, your latest changes will not be run. Changes to the UI can be
made while the server is still running and Parcel will update the UI with HMR.

## Architecture

Currently there are 7 packages apart of Snoopy. 5 of which are published to NPM.

### api

Contains names of all events that are sent between server and client (UI).

### cli

Part of Snoopy that the user interacts with on the command line. The CLI starts
the server and shows help and version information.

### search

Package that scans source code and finds React components, themes, and style
files.

### Server

Long running [Express](https://expressjs.com/) server that is started by the
CLI. It Bundles together our UI and the users components (found by the search
package) using [Parcel](https://parceljs.org/api.html) and a [custom asset
type](https://parceljs.org/asset_types.html). It also watches for changes to the
current working directory and will force Parcel to rebundle when the user adds a
component or annotation somewhere that Parcel was not previously watching.

### ui

Our UI that displays the users components.

### ui-storybook

[Storybook](https://storybook.js.org/) for our UI. We did not want to pollute
our UI with a bunch of Storybook config so we are using a separate package.

_This is not published to NPM._

### vscode-plugin

Plugin for [VSCode](https://code.visualstudio.com/) that will automatically
switch components in the UI to match the component you are editing in VSCode.
