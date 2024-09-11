import { app_path } from "../../../../../utils/app_path/index.js";
import { execSync } from "child_process";

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("prisma-generate-main-schema")
        .alias("ms+")
        .description("generate prism main schema")
        .action(() => {
            execSync(`node ./server/database/generate_main_schema.js`, {
                cwd: app_path,
                stdio: "inherit",
            });
        });
};
export { create_command };
