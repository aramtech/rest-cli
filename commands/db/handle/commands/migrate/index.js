import { app_path } from "../../../../../utils/app_path/index.js";
import { execSync } from "child_process";

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("migrate")
        .alias("m")
        .description("run prisma migrate")
        .action(() => {
            try {
               
            execSync(`prisma migrate dev --schema=./prisma/main_schema.prisma `, {
                cwd: app_path,
                stdio: "inherit",
            }); 
            } catch (error) {
             
            execSync(`npx prisma migrate dev --schema=./prisma/main_schema.prisma `, {
                cwd: app_path,
                stdio: "inherit",
            });   
            }
        });
};
export { create_command };
