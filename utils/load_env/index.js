import { src_path } from "../src_path/index.js";
import { load_json } from "../load_json/index.js";
import path from "path";
/**
 *
 * @returns {import("$/server/env.json")}
 */
const load_env = () => {
    // loading ts config
    const env_path = path.join(src_path, "env.json");
    return load_json(env_path);
};

export { load_env };
