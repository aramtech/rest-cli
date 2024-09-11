import { local_log_decorator } from "$/server/utils/log/index.js";

const log = await local_log_decorator("Main Seeder", "blue", true, "info");

const seeder_paths_list = ["./seeders/addresses.seeder.js", "./seeders/super_admin.seeder.js"];
const run = async function (app) {
    for (const path of seeder_paths_list) {
        log("running production seeder: ", path);
        const run = (await import(path)).run;
        if (typeof run == "function") {
            await run(app);
        }
    }
};

export { run };
