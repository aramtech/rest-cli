import fs from "fs";
import path from "path";
import logger from "../../logger.js";
import { src_path } from "../../utils/src_path/index.js";

/**
 *
 * @param {boolean} prod
 * @returns {object.<string,string>}
 */
const seeders_directory_path = path.join(src_path, "startup", "_0_seed", "seeders");
const seeders_dev_directory_path = path.join(src_path, "startup", "dev_seed", "seeders");

/**
 *
 * @param {string} item
 * @returns {boolean}
 */
function is_seeder(item) {
    return !!item.match(/\.seeder\.(?:js|ts)$/);
}

/**
 *
 * @param {string} dir_path
 * @param {object.<string,string>} list
 */
function list_seeders(dir_path = seeders_directory_path, list = {}) {
    if(!fs.existsSync(dir_path)){
        return {}
    }
    const content = fs.readdirSync(dir_path);
    for (const item of content) {
        const item_path = path.join(dir_path, item);
        const item_stats = fs.statSync(item_path);
        if (item_stats.isDirectory()) {
            list_seeders(item_path);
        } else {
            if (is_seeder(item)) {
                list[item.split(".seeder")[0]] = item_path;
            }
        }
    }
}

const seeders_list = {};
list_seeders(seeders_directory_path, seeders_list);

const seeders_dev_list = {};
list_seeders(seeders_dev_directory_path, seeders_dev_list);

async function run_seeder(seeder_path) {
    const seeder_runner = (await import(seeder_path))?.run;
    if (seeder_runner) {
        await seeder_runner();
    }
}

/**
 *
 * @param {string} seeder_name
 *
 */
async function run_development_seeder(seeder_name, options) {
    if (options.all) {
        const files = Object.values(seeders_dev_list);
        if (!files.length) {
            logger.warning("no seeders found!");
            return;
        }
        for (const seeder of files) {
            await run_seeder(seeder);
        }
    }

    const seeder_path = seeders_dev_list[seeder_name];
    if (!seeder_path) {
        logger.error("Development Seeder Not Found");
        logger.warning(`
available development seeders: 
${JSON.stringify(seeders_list, null, 4)}
        `);
        return;
    }

    await run_seeder(seeder_path);
}

/**
 * @param {string} seeder_name
 *
 */
async function run_production_seeder(seeder_name, options) {
    if (options.all) {
        const files = Object.values(seeders_list);
        if (!files.length) {
            logger.warning("no seeders found!");
            return;
        }
        for (const seeder of files) {
            await run_seeder(seeder);
        }
    }

    const seeder_path = seeders_list[seeder_name];
    if (!seeder_path) {
        logger.error("Production Seeder Not Found");
        logger.warning(`
available production seeders: 
${JSON.stringify(seeders_list, null, 4)}
        `);
        return;
    }

    await run_seeder(seeder_path);
}

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("seed")
        .alias("s")
        .description(`Seed components by providing the name of the seeder. `)
        .addHelpText(
            "after",
            `
know that by default seeders run on server launch.

Example:> rest s super_admin

which will run super_admin.seeder.js

available production seeders are: 
${JSON.stringify(seeders_list, null, 4)}



available development seeders are: 
${JSON.stringify(seeders_dev_list, null, 4)}
        
        `,
        )
        .argument(
            "<seeder-name>",
            `
The name of the seeder file. It should end with ".seeder.js", 
and should exist in "server/startup/_0_seed" for production seeders or 
"server/startup/dev_seed" for development only seeders (mock data)         
        `,
        )
        .option("-d,--dev", "seed a development mock data file")
        .option("-a,--all", "run all seeders")
        .action((seeder_file_name, options) => {
            if (options.dev) {
                run_development_seeder(seeder_file_name, options);
            } else {
                run_production_seeder(seeder_file_name, options);
            }
        });
};
export { create_command };
