const run_sub_command_line = (await import("./handle/index.js")).run_sub_command_line;

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    const db_command = program.command("database").alias("db").description("database set of commands");
    run_sub_command_line(db_command);
};
export { create_command };
