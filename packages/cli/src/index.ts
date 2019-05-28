#!/usr/bin/env node

// tslint:disable-next-line:no-submodule-imports
import {start} from "@prodo-ai/snoopy-server/src";
import * as yargs from "yargs";

// tslint:disable-next-line:no-var-requires
const {version} = require("../package.json");

const startServer = async () => {
  await start();
};

yargs.command("*", false, {}, () => {
  startServer();
});

export const run = async () => {
  yargs
    .usage("Usage $0 <command> [options]")
    .help("help")
    .alias("h", "help")
    .version("version", version)
    .alias("v", "version");

  (yargs as any).getOptions().boolean.splice(-2);

  // tslint:disable-next-line:no-unused-expression
  yargs.demandCommand().argv;
};

// tslint:disable-next-line: no-console
run().catch(e => console.log(e));
