import { Command } from "commander";
import logger from "../../../../../logger.js";
import { load_env } from "../../../../../utils/load_env/index.js";
import { src_path } from "../../../../../utils/src_path/index.js";



const create_command = (program: Command) => {
    program
        .command("generate-user-jwt <user_identifier>")
        .alias("g-jwt")
        .description("generate user jwt based on his username and credentials")
        .option("--id")
        .option("--user_name")
        .action(async (user_identifier, { id, user_name }) => {
            const jwt_base = (await import("jsonwebtoken")).default;
            const env = load_env()
            const jwt = {
                generate: (obj: any) => jwt_base.sign(obj, env.auth.jwt.secret, env.auth?.jwt?.options || undefined),
                verify: (token: string) => {
                    return jwt_base.verify(token, env.auth.jwt.secret);
                },
            };
            const client = (await import(`${src_path}/modules/index.js`)).default
            function generate_user_jwt_token(user: any): string {
                return jwt.generate({ user_id: user.user_id, username: user.username });
            }
            let body             
            if(id){
                body = {
                    user_id: +user_identifier
                }
            }else{
                if(user_name){
                    body = {
                        user_name: user_identifier
                    }
                }else{
                    body = {
                        username: user_identifier
                    }                
                }
            }

            const user = await client.users.findFirst({
                where: {
                    deleted: false, 
                    ...body
                }
            })
            if(!user){
                logger.error("user not found"); 
                process.exit()
            }
            logger.success(generate_user_jwt_token(user))
            process.exit()
        });
};
export { create_command };
