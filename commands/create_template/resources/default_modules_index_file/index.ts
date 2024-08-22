// @ts-nocheck
const client = (await import("../database/prisma.js")).default;

import { set_client } from "../utils/rules/index.js";
import requester_fields from "./utils/requester_fields/index.js";

const Modules = client
    .$extends({
        client: {
            requester_fields: requester_fields,
        },
    })
    .$extends((await import("./Addressing/instance/index.js")).AddressingInstanceClientExtensionArgs)
    .$extends((await import("./Addressing/static/index.js")).AddressingStaticClientExtensionArgs)
    .$extends((await import("./User/instance/index.js")).UserInstanceClientExtensionArgs)
    .$extends((await import("./User/static/index.js")).UserStaticClientExtensionArgs)

set_client(Modules);

export default Modules;
