import { create_command as generate_user_jwt } from "./generate_user_jwt/index.js";

const create_commands = (program) => {
    generate_user_jwt(program);
};

export { create_commands };
