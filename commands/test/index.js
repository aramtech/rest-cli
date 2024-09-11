import { execSync } from "child_process";
import { app_path } from "../../utils/app_path/index.js";

/**
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("test")
        .alias("t")
        .description("use it to run tests")
        .option("-p, --pattern <value>", "pattern to filter tests with", "")
        .option("-w, --watch", "Whether or not to run tests in watch mode", "")
        .action(async ({ pattern, watch }) => {
            execSync(`rest l && NODE_ENV=test npx vitest ${pattern} --watch=${!!watch}`, {
                stdio: "inherit",
                cwd: app_path,
            });
            process.exit(0);
        });
};
export { create_command };
