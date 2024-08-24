import { create_command as bench } from "./bench/index.js";
import { create_command as build } from "./build/index.js";
import { create_command as create_route } from "./create_route/index.js";
import { create_command as create_routers_directory_alias } from "./create_routers_directory_alias/index.js";
import { create_command as create_template } from "./create_template/index.ts";
import { create_command as db } from "./db/index.js";
import { create_command as dev } from "./dev/index.js";
import { create_command as format } from "./fmt/index.js";
import { create_command as basetag_link } from "./link/index.js";
import { create_command as make_authorities_type_list } from "./make_authorities_type_list/index.js";
import { create_command as postinstall } from "./postinstall/index.ts";
import { create_command as remove_all_markdown_descriptions } from "./remove_all_markdown_descriptions/index.js";
import { create_command as seed } from "./seed/index.js";
import { create_command as start } from "./start/index.js";
import { create_command as test } from "./test/index.js";

/**
 *
 * @param {import("commander").Command} program
 */
const create_commands = (program) => {
    create_template(program);
    create_route(program);
    postinstall(program);
    basetag_link(program);
    test(program);
    build(program);
    make_authorities_type_list(program);
    db(program);
    dev(program);
    create_routers_directory_alias(program);
    start(program);
    seed(program);
    format(program);
    bench(program);
    remove_all_markdown_descriptions(program)
};

export { create_commands };
