import { execSync } from "child_process";
import { app_path } from "../../utils/app_path/index.js";

/**
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("bench")
        .alias("bn")
        .description("use it to run performance benchmarks")
        .option("-p, --pattern <value>", "pattern to filter benchmarks with with", "")
        .action(async ({ pattern }) => {
            execSync(`rest l && NODE_ENV=test npx vitest bench ${pattern} --watch=false`, {
                stdio: "inherit",
                cwd: app_path,
            });
            process.exit(0);
        });
};
export { create_command };
