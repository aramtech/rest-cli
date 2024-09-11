// import env from "$/server/env.json" assert { type: "json" };
import { InvalidArgumentError } from "commander";

import url from "url";
const fs = (await import("fs")).default;
import path from "path";
import logger from "../../logger.js";
import { app_path } from "../../utils/app_path/index.js";

const src_path = path.resolve(path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../../../../."));
const env_path = path.join(src_path, "env.json");

/**
 * @type {import("$/server/env.json")}
 */
const env = JSON.parse(fs.readFileSync(env_path, "utf-8"));

const router_dir_path = path.join(app_path, env.router.router_directory);

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("create-routers-dir-alias")
        .alias("rda+")
        .description("use it to a routers directory alias")
        .argument("<directory>", `source routers directory relative path e.g "A/some_routes"`, (source_router_directory, _) => {
            if (!source_router_directory || typeof source_router_directory != "string") {
                throw new InvalidArgumentError("Please Provide the routers directory name as in 'my/routes'");
            }

            if (source_router_directory.startsWith("./")) {
                throw new InvalidArgumentError("the source routers directory must be relative to routers directory: " + router_dir_path);
            }
            const full_source_router_directory = path.join(router_dir_path, source_router_directory);

            if (!fs.existsSync(full_source_router_directory)) {
                throw new InvalidArgumentError(`${source_router_directory} does not exists, please make sure its valid`);
            }

            const stats = fs.statSync(full_source_router_directory);
            if (!stats.isDirectory()) {
                throw new InvalidArgumentError(`${full_source_router_directory} is not a directory, please make sure its valid`);
            }

            return source_router_directory;
        })
        .argument(
            "<alias>",
            `where to put the alias, it must be relative to the routers directory and not in the source routers directory e.g. /B/some_routes_alias`,
            (alias_path, p) => {
                if (!alias_path || typeof alias_path != "string") {
                    throw new InvalidArgumentError("Please Provide the alias name as in 'my/new/alias'");
                }

                if (!alias_path.endsWith(env.router.alias_suffix)) {
                    alias_path += env.router.alias_suffix;
                }

                if (alias_path.startsWith("./")) {
                    throw new InvalidArgumentError("the source routers directory must be relative to routers directory: " + router_dir_path);
                } else {
                    alias_path = path.join(router_dir_path, alias_path);
                }

                if (fs.existsSync(alias_path)) {
                    throw new InvalidArgumentError.error(`Alias ${alias_path} already exists, please check it`);
                }

                return alias_path;
            },
        )
        .option("-r, --recursive", "Create the alias path recursively", false)
        .action(
            /**
             *
             * @param {string} directory
             * @param {string} alias
             */
            async (directory, alias, options) => {
                const full_source_router_directory = path.join(router_dir_path, directory);
                if (alias.match(RegExp(`${full_source_router_directory}(?:$|\\/)`))) {
                    return logger.error(`Can not create alias ${alias} within ${directory}, this will cause infinite loop.`);
                }

                if (options.recursive) {
                    fs.mkdirSync(path.dirname(alias), { recursive: true });
                }

                if (!fs.existsSync(path.dirname(alias))) {
                    return logger.error("the target directory does not exists, use -r if you want to make the directory recursively");
                }
                fs.writeFileSync(alias, `export default "${directory}"`);
            },
        );
};
export { create_command };
