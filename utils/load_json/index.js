import fs from "fs";

/**
 *
 * @param {String} json_path
 * @returns {*}
 */
const load_json = (json_path) => {
    let json = fs.readFileSync(json_path, "utf-8");
    json = json
        .split("\n")
        .filter((line) => {
            return !line.match(/^\s*?\/\//);
        })
        .join("\n");
    json = json.replaceAll(/\/\*(.|\n)*?\*\//g, "");
    json = json.replaceAll(/\,((\s|\n)*?(?:\}|\]))/g, "$1");
    json = JSON.parse(json);
    return json;
};
export { load_json };
