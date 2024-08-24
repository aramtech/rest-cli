import path from "path";
import url from "url";
/**
 * @type {String}
 */
const src_path = path.resolve(path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../../../../."));
export { src_path };
