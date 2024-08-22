const app_path = (await import("../../utils/app_path/index.js")).app_path;
import fs from "fs";
import path from "path";
import { load_env } from "../../utils/load_env/index.js";
import { src_path } from "../../utils/src_path/index.js";

const remove_markdown_descriptions = (current_dir: string, description_regex: RegExp)=>{
    const directory_content = fs.readdirSync(current_dir); 
    for(const item of directory_content){
        const item_full_path = path.join(current_dir, item); 
        const item_stats = fs.statSync(item_full_path); 
        if(item_stats.isDirectory()){
            remove_markdown_descriptions(item_full_path, description_regex)
        }else{
            if(item.match(description_regex)){
                fs.rmSync(item_full_path)
            }
        }
    }

}

/**
 *
 * @param {import("commander").Command} program
 */
const create_command = (program) => {
    program
        .command("remove_all_md_routers_descriptors")
        .alias("rmrmd")
        .description("use it to remove all markdown descriptions file for routers")
        .action(async () => {
            const env = await load_env()
            const router_full_directory_path = path.join(src_path, env.router.router_directory)
            const description_regex = RegExp(env.router.description_suffix_regx)
            remove_markdown_descriptions(router_full_directory_path, description_regex)

            process.exit(0);
        });
};
export { create_command };
