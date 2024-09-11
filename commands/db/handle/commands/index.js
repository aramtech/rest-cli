import { create_command as prisma_generate } from "./prisma_generate/index.js";
import { create_command as prisma_generate_main_schema } from "./prisma_generate_main_schema/index.js";
import { create_command as initialize_mysql } from "./initialize_mysql/index.js";
import { create_command as migrate } from "./migrate/index.js";
import { create_command as deploy } from "./deploy/index.js";
import { create_command as migrate_generate } from "./migrate_generate/index.js";

/**
 *
 * @param {import("commander").Command} program
 */
const create_commands = (program) => {
    prisma_generate(program);
    prisma_generate_main_schema(program);
    initialize_mysql(program);
    migrate(program);
    deploy(program);
    migrate_generate(program);
};

export { create_commands };
