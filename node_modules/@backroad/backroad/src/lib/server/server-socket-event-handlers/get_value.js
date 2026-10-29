"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = void 0;
const tslib_1 = require("tslib");
const superjson_1 = tslib_1.__importDefault(require("superjson"));
const getValue = (_, session) => (props, callback) => {
    callback(superjson_1.default.stringify(session.valueOf(props.id)));
};
exports.getValue = getValue;
//# sourceMappingURL=get_value.js.map