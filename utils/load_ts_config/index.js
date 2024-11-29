import { app_path } from "../app_path/index.js";
import { load_json } from "../load_json/index.js";
import path from "path";
/**
 *
 * @returns {import("$/tsconfig.json")}
 */
const load_ts_config = () => {
    // loading ts config
    const ts_config_path = path.join(app_path, "tsconfig.json");
    return load_json(ts_config_path);
};

export { load_ts_config };
