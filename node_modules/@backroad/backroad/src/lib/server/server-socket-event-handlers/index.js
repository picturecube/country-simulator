"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketEventHandlers = void 0;
const get_value_1 = require("./get_value");
const run_script_1 = require("./run_script");
const set_value_1 = require("./set_value");
const unset_value_1 = require("./unset_value");
exports.socketEventHandlers = {
    getValue: get_value_1.getValue,
    runScript: run_script_1.runScript,
    setValue: set_value_1.setValue,
    unsetValue: unset_value_1.unsetValue,
};
//# sourceMappingURL=index.js.map