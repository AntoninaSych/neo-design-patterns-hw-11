"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdValidator = void 0;
const AbstractHandler_1 = require("../AbstractHandler");
class UserIdValidator extends AbstractHandler_1.AbstractHandler {
    process(record) {
        const { userId } = record;
        if (typeof userId !== "string" || userId.trim().length === 0) {
            throw new Error("Invalid userId");
        }
        return { ...record, userId: userId.trim() };
    }
}
exports.UserIdValidator = UserIdValidator;
