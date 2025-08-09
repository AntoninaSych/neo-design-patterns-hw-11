"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelValidator = void 0;
const AbstractHandler_1 = require("../AbstractHandler");
const allowed = new Set([
    "info",
    "warning",
    "critical",
]);
class LevelValidator extends AbstractHandler_1.AbstractHandler {
    process(record) {
        if (!allowed.has(record.level)) {
            throw new Error("Invalid level");
        }
        return record;
    }
}
exports.LevelValidator = LevelValidator;
