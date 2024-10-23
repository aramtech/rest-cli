import fs from "fs";
import path from "path";
import { app_path } from "../../utils/app_path/index.js";

const create_command = (program: import("commander").Command) => {
    program
        .command("set-env <key> <value>")
        .description("use it to run in dev mode")
        .action(async (key, value) => {
            const processEnvJsonFullPath = path.join(app_path, ".env.json")
            if(!fs.existsSync(processEnvJsonFullPath)){
                fs.writeFileSync(processEnvJsonFullPath, "{}")
            }
            const env = JSON.parse(fs.readFileSync(processEnvJsonFullPath, "utf-8"))
            
            env[key] = value 
            fs.writeFileSync(processEnvJsonFullPath, JSON.stringify(env, null, 4))
            

            process.exit(0);
        });
};
export { create_command };
