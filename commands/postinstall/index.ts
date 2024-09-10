import { execSync } from "child_process";
import { app_path } from "../../utils/app_path/index.js";


const create_command = (program: import("commander").Command) => {
    program
        .command("postinstall")
        .alias("pi")
        .description("use it to run post package installation script")
        .action(async () => {
            execSync("rest l", {
                stdio: "inherit",
                cwd: app_path,
            });
            try {
                execSync("nohup sleep 1 && npx prettier package.json --write & disown", {
                    stdio: "ignore",
                    cwd: app_path,
                });
            } catch (error) {}
            process.exit(0);
        });
};
export { create_command };
