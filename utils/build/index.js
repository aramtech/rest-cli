import Logger from "../../logger.js";

/**
 * @typedef {Object} Options
 * @property {boolean} [debase]
 */

/**
 *
 * @param {Options} options
 */
const build = async (options = {}) => {
    const fs = (await import("fs")).default;
    const path = (await import("path")).default;
    const execSync = (await import("child_process")).execSync;
    const ts_config = (await import("../../utils/load_ts_config/index.js")).load_ts_config();
    const env = (await import("../../utils/load_env/index.js")).load_env();
    const app_path = (await import("../../utils/app_path/index.js")).app_path;

    const outDir = ts_config.compilerOptions?.outDir;
    if (!outDir) {
        Logger.error("Build directory not specified");
        process.exit(1);
    }

    execSync(`rm -rf ${outDir}`, {
        cwd: app_path,
        stdio: "inherit",
    });

    execSync(`cp -R server ${outDir}`, {
        cwd: app_path,
        stdio: "inherit",
    });

    execSync("npx tsc", {
        cwd: app_path,
        stdio: "inherit",
    });

    function change_base_tag_symbol(prefix = path.join(app_path, outDir)) {
        const build_content = fs.readdirSync(prefix);
        for (const item of build_content) {
            const item_path = path.join(prefix, item);
            const item_stat = fs.statSync(item_path);
            if (item_stat.isDirectory()) {
                change_base_tag_symbol(item_path);
            } else {
                if ((item.endsWith(".ts") && !item.endsWith(".d.ts")) ||  item.endsWith(".test.js")) {
                    execSync(`rm  ${item_path}`, {
                        cwd: app_path,
                        stdio: "inherit",
                    });
                } else if ((!options?.debase && item.endsWith(".js")) || item.endsWith("json")) {
                    let js_code = fs.readFileSync(item_path, "utf-8");
                    // import(path.join(app_path, 
                    js_code = js_code.replaceAll(RegExp(`(?<=import\\(path\\.join\\(app_path,.*?)server`, "g"), `/${outDir}`);
                    js_code = js_code.replaceAll(RegExp(`(?<=${env.basetag_symbol.replaceAll("$", "\\$")})\\/server`, "g"), `/${outDir}`);
                    js_code = js_code.replaceAll(RegExp(`\\.ts(?='|")`, "g"), `.js`);
                    fs.writeFileSync(item_path, js_code, { encoding: "utf-8" });
                } else if (options?.debase && item.endsWith(".js")) {
                    let js_code = fs.readFileSync(item_path, "utf-8");
                    js_code = js_code.replaceAll(RegExp(`\\.ts(?='|")`, "g"), `.js`);
                    js_code = js_code.replaceAll(
                        RegExp(`('|"|\`)(${env.basetag_symbol.replaceAll("$", "\\$")}\\/server(.*?))\\1`, "g"),
                        (full_match, quote, full_path, path_post_server) => {
                            const to_path = path.join(app_path, outDir, path_post_server);
                            return `"./${path.relative(path.dirname(item_path), to_path)}"`;
                        }
                    );

                    fs.writeFileSync(item_path, js_code, { encoding: "utf-8" });
                }
            }
        }
    }
    change_base_tag_symbol();


    env.build_runtime = true;
    env.environment = "production"
    env.logging.hide_all_logs_in_production = true
    let env_json = JSON.stringify(env, null, 4).replaceAll(RegExp(`(?<=${env.basetag_symbol.replaceAll("$", "\\$")})\\/server`, "g"), `/${outDir}`);
    env_json = env_json.replaceAll(RegExp(`\\.ts(?='|")`, "g"), `.js`);


    fs.writeFileSync(path.join(app_path, outDir, "env.json"), env_json);
};

export { build };
