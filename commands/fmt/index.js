import { exec, execSync } from "child_process";
import { app_path } from "../../utils/app_path/index.js";

const create_command = (program) => {
    program
        .command("format")
        .alias("fmt")
        .alias("pretty")
        .description("use it to format the source code of your project.")
        .action(async () => {
            exec("npx prettier . --write ", {
                cwd: app_path,
            });
            process.exit(0);
        });
};
export { create_command };
