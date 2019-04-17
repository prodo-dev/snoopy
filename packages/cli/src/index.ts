#!/usr/bin/env node

import {start} from "@prodo/snoopy-server";
import * as yargs from "yargs";

const startServer = async (path: string) => {
  if (!path) {
    // tslint:disable-next-line: no-console
    console.error("Need to provide path to components");
    process.exit(1);
  }

  await start();
};

yargs.command({
  command: "start <path>",
  describe: "Start the local server",
  handler: (argv: any) => startServer(argv.path),
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

run().catch(e => console.log(e));
