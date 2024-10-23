const app_path = (await import("../../utils/app_path/index.js")).app_path;
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import logger from "../../logger.js";
import { load_ts_config } from "../../utils/load_ts_config/index.js";
/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("start")
        .description("use it to run production build mode")
        .action(async () => {
            const ts = load_ts_config();
            const build_index_relative_path = path.join(ts.compilerOptions.outDir || "dist", "index.js");
            if (!fs.existsSync(path.join(app_path, build_index_relative_path))) {
                logger.error("There is not build, build the project with 'rest b'");
                return;
            }
            const bun = execSync("which bun", {
                encoding: "utf-8",
            });

            if (bun) {
                execSync(`bun --no-warnings ${build_index_relative_path}`, {
                    stdio: "inherit",
                    cwd: app_path,
                });
            } else {
                execSync(`node --no-warnings ${build_index_relative_path}`, {
                    stdio: "inherit",
                    cwd: app_path,
                });
            }

            process.exit(0);
        });
};
export { create_command };
