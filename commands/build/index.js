import Logger from "../../logger.js";
/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("build")
        .alias("b")
        .option("--debase")
        .description("use it to run basetag link")
        .action(async (options) => {
            const build = (await import("../../utils/build/index.js")).build
            await build({debase: options?.debase})
        });
};
export { create_command };
