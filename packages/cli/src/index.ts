#!/usr/bin/env node

import {start} from "@prodo/snoopy-server";
import * as yargs from "yargs";

const startServer = async () => {
  await start();
};

yargs.command({
  command: "start",
  describe: "Start the local server",
  handler: startServer,
});

yargs.command("*", false, {}, args => {
  // tslint:disable-next-line:no-console
  console.log(
    `\n Invalid command ${
      args._
    }. See "--help" for a list of available commands.\n`,
  );
});

export const run = async () => {
  yargs
    .usage("Usage $0 <command> [options]")
    .help("help")
    .alias("h", "help")
    .version("version", "0.0.1")
    .alias("v", "version");

  (yargs as any).getOptions().boolean.splice(-2);

  // tslint:disable-next-line:no-unused-expression
  yargs.demandCommand().argv;
};

// tslint:disable-next-line:no-console
run().catch(e => console.log(e));
