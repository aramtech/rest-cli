import { InvalidArgumentError } from "commander";

import path from "path";
import url from "url";
const fs = (await import("fs")).default;

const src_path = path.resolve(path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../../../../."));

const env_path = path.join(src_path, "env.json");

/**
 * @type {import("$/server/env.json")}
 */
const env = JSON.parse(fs.readFileSync(env_path, "utf-8"));

const router_dir_path = path.join(src_path, env.router.router_directory);
const empty_route_path = !env.router?.empty_route_path ? path.join(router_dir_path, "empty_route.js") : path.join(src_path, env.router.empty_route_path);

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    const methods = ["get", "post", "put", "delete"];
    program
        .command("create-route")
        .alias("r+")
        .description("use it to create new route")
        .argument(
            "<route>",
            `route relative path e.g "your/example/route" or if you want to create a sub route in the current the current route "./your/sub/route"`,
            (new_route, _) => {
                if (!new_route || typeof new_route != "string") {
                    throw new InvalidArgumentError("Please Provide the route name as in 'aram_rest r+ my/new/route get'");
                }

                if (!new_route.match(env.router.router_suffix_regx)) {
                    new_route += "/index" + env.router.router_suffix;
                }
                if (new_route.startsWith("./")) {
                    if (!process.cwd().startsWith(router_dir_path)) {
                        throw new InvalidArgumentError("you are trying to create sub route, but you are not in the routers directory: " + router_dir_path);
                    }
                    new_route = path.join(process.cwd(), new_route);
                } else {
                    new_route = path.join(router_dir_path, new_route);
                }

                if (fs.existsSync(new_route)) {
                    throw new InvalidArgumentError(`Route ${new_route} already exists, please check it`);
                }

                return new_route;
            },
        )
        .argument(
            "[method]",
            `route method  "get" | "post"| "put" | "delete" `,
            (method, _) => {
                if (!methods.includes(method)) {
                    throw new InvalidArgumentError(`Please Provide a valid route method  "get" | "post"| "put" | "delete"`);
                }
                return method;
            },
            "get",
        )
        .action(async (new_route, route_method) => {
            console.log("Creating Route", "\n", "new Route path", new_route, "\n", "route_method", route_method);
            let empty_route = fs.readFileSync(empty_route_path, "utf-8");
            empty_route = empty_route.replace(/(?<=router(\s|\n)*?\.(\s|\n)*?).+?(?=(\s|\n)*?\()/, route_method);

            fs.cpSync(empty_route_path, new_route, {
                recursive: true,
            });
            fs.writeFileSync(new_route, empty_route);
        });
};
export { create_command };
