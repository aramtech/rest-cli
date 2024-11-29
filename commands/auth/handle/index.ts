#!/usr/bin/env node

const { create_commands } = await import("./commands/index.js");

const run_sub_command_line = (program) => {
    program.name("auth").description("set of commands for user authentication.").version("1.0.0");

    create_commands(program);
};

export { run_sub_command_line };
