import { app_path } from "../../../../../utils/app_path/index.js";
import { execSync } from "child_process";

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("prisma-generate")
        .alias("pg")
        .description("run prisma generate")
        .action(() => {
            try {
                execSync(`prisma generate --schema=./prisma/main_schema.prisma`, {
                    cwd: app_path,
                    stdio: "inherit",
                });
            } catch (error) {
                execSync(`npx prisma generate --schema=./prisma/main_schema.prisma`, {
                    cwd: app_path,
                    stdio: "inherit",
                });
            }
        });
};
export { create_command };
