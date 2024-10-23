import Logger from "../../logger.js";
/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("link")
        .alias("l")
        .option("-d, --delete", "Delete Base Tag", false)
        .description("use it to run basetag link")
        .action(async (options) => {
            try {
                const fs = (await import("fs")).default;
                const url = (await import("url")).default;
                const path = (await import("path")).default;
                const fileExists = function (path) {
                    try {
                        fs.accessSync(path);
                        return true;
                    } catch (e) {
                        return false;
                    }
                };
                const app_path = path.resolve(path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../../../../../."));
                const env_path = path.join(app_path, "server/env.json");
                const env = JSON.parse(fs.readFileSync(env_path, "utf-8"));
                const basePath = app_path;
                const modulesDir = "node_modules";
                const modulesPath = path.resolve(app_path, modulesDir);
                if (!fs.existsSync(modulesPath)) {
                    throw new Error(`${modulesDir} directory does not exist`);
                }
                const linkPath = path.resolve(modulesPath, env.basetag_symbol || "$");
                if (options?.delete) {
                    if (fileExists(linkPath)) {
                        fs.unlinkSync(linkPath);
                    } else {
                        Logger.warning("there is no link");
                    }
                    return;
                }
                if (fileExists(linkPath)) {
                    if (basePath === fs.realpathSync(linkPath)) {
                        if (options?.delete) {
                            fs.unlinkSync(linkPath);
                            return;
                        }
                        Logger.warning("symlink already points to base");
                        return;
                    }
                    Logger.error(`file already exists: ${linkPath}`);
                }
                fs.symlinkSync("..", linkPath, "junction");
                Logger.success(`created ${env.basetag_symbol} symlink to ${basePath}`);
            } catch (error) {
                console.log(error);
                Logger.error(`${error}\n\nsymlink not created`);
            }
        });
};
export { create_command };
