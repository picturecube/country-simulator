"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectHasher = void 0;
const tslib_1 = require("tslib");
const fast_json_stable_stringify_1 = tslib_1.__importDefault(require("fast-json-stable-stringify"));
const crypto = tslib_1.__importStar(require("crypto"));
class ObjectHasher {
    static #hashCache = {};
    static hash(obj) {
        const deterministicJSONString = (0, fast_json_stable_stringify_1.default)(obj);
        if (this.#hashCache[deterministicJSONString]) {
            return this.#hashCache[deterministicJSONString];
        }
        else {
            const hash = this.#computeHash(deterministicJSONString);
            this.#hashCache[hash] = hash;
            return hash;
        }
    }
    static #computeHash(input) {
        return crypto.createHash('md5').update(input).digest('hex');
    }
}
exports.ObjectHasher = ObjectHasher;
//# sourceMappingURL=object-hasher.js.map