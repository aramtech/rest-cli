const run_sub_command_line = (await import("./handle/index.js")).run_sub_command_line;

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    const command = program.command("auth").description("user authentication set of commands");
    run_sub_command_line(command);
};
export { create_command };
