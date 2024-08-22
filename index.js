#!/usr/bin/env tsx

import { program } from "commander";

program.name("aram_rest").description("set of commands to make rest api development easy.").version("1.0.0");

import { create_commands } from "./commands/index.js";
import logger from "./logger.js";
import { app_path } from "./utils/app_path/index.js";
if (!process.cwd().match(RegExp(`${app_path}(?:$|\\/)`))) {
    logger.error("Your Are not inside the project");
    logger.warning("the app path is: ", app_path);
    console.log();
    logger.text(
        "If you are in Rest project use 'npm i -g' to install the command line for that project, or use 'npx rest'",
    );
    process.exit(1);
}

create_commands(program);

program.parse();
