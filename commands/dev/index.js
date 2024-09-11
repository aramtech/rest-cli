import { execSync } from "child_process";
import { app_path } from "../../utils/app_path/index.js";

/**
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("dev")
        .description("use it to run in dev mode")
        .action(async () => {
            execSync("npx nodemon", {
                stdio: "inherit",
                cwd: app_path,
            });
            process.exit(0);
        });
};
export { create_command };
