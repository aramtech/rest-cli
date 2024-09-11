import env_obj from "../../env.js";

import { local_log_decorator } from "$/server/utils/log/index.js";

const log = await local_log_decorator("Dev Seeder", "green", true, "info");

const seeder_paths_list = [
];

const run = async function (app) {
    if (env_obj.environment != "development") {
        return;
    }
    for (const path of seeder_paths_list) {
        log("running dev seeder", path);
        const run = (await import(path)).run;
        if (typeof run == "function") {
            await run(app);
        }
    }
};

export { run };
