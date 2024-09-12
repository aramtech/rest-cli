import { execSync } from "child_process";
import Logger from "../../logger.js";
import { src_path } from "../../utils/src_path/index.js";
import path from "path";

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("@authorities_types")
        .alias("@at")
        .description("create the list of authorities types")
        .action(async (options) => {
            const build_authorities = (await import("$/server/modules/User/static/utils/authorities/build_authorities.ts")).seed_authorities;
            await build_authorities();
        });
};
export { create_command };
