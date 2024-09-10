#!/usr/bin/env node

const { create_commands } = await import("./commands/index.js");

const run_sub_command_line = (program) => {
    program.name("db").description("set of database commands.").version("1.0.0");

    create_commands(program);
};

export { run_sub_command_line };
