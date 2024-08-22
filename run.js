#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import { argv } from "process";
import { fileURLToPath } from "url";

const bun = execSync("which bun", {
    encoding: "utf-8",
});

const current_dir = fileURLToPath(new URL("./", import.meta.url));
try {
    if (bun) {
        execSync(`bun ${path.join(current_dir, "index.js")} ${argv.slice(2).join(" ")}`, {
            stdio: "inherit",
        });
    } else {
        execSync(`tsx ${path.join(current_dir, "index.js")} ${argv.slice(2).join(" ")}`, {
            stdio: "inherit",
        });
    }
} catch (error) {
    process.exit(1);
}
