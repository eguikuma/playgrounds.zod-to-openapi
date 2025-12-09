#!/usr/bin/env node

import chalk from "chalk";
import { config } from "dotenv";

config();

import { ZodocsError } from "../errors";
import { ConfigLoader, DocumentWriter, SchemaLoader } from "../models";

const rootDirectory = process.cwd();

const generate = async () => {
  console.log(chalk.blue("🚀 Starting documentation generation\n"));

  try {
    const config = await new ConfigLoader(rootDirectory).load();

    await new SchemaLoader(rootDirectory).load(
      config.input.endpointFileName,
      config.input.directories,
    );

    const toPath = await new DocumentWriter().write(config);

    console.log(
      chalk.green(`✨ Successfully generated ${chalk.bold(toPath)}\n`),
    );
  } catch (e) {
    if (e instanceof ZodocsError) {
      console.error(chalk.red(`❌ ${e.message}\n`));
    } else {
      console.error(chalk.red(e));
    }

    process.exit(1);
  }
};

process.on("unhandledRejection", (e) => {
  console.error(e);

  process.exit(1);
});

process.on("uncaughtException", (e) => {
  console.error(e);

  process.exit(1);
});

void generate();
