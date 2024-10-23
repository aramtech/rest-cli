import { execSync } from "child_process";
import { app_path } from "../../../../../utils/app_path/index.js";

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("migrate-generate")
        .alias("m+")
        .description("generate main schema & run prisma migrate")
        .action(() => {
            execSync(`node ./server/database/generate_main_schema.js`, {
                cwd: app_path,
                stdio: "inherit",
            });
            try {
                execSync("prisma migrate dev --schema=./prisma/main_schema.prisma", {
                    cwd: app_path,
                    stdio: "inherit",
                });
            } catch (error) {
                execSync("npx prisma migrate dev --schema=./prisma/main_schema.prisma", {
                    cwd: app_path,
                    stdio: "inherit",
                });
            }
        });
};
export { create_command };
