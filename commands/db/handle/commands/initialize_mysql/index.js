/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("initialize-mysql")
        .alias("im")
        .description("initialize mysql, create admin user & set time zone")
        .action(async () => {
            await import("$/database/initialize.js");
        });
};
export { create_command };
