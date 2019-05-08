#!/usr/bin/env node

import {start} from "@prodo-ai/snoopy-server";
import * as yargs from "yargs";

const version = "0.1.0"

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
