"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageTrimmer = void 0;
const AbstractHandler_1 = require("../AbstractHandler");
class MessageTrimmer extends AbstractHandler_1.AbstractHandler {
    process(record) {
        if (typeof record.message !== "string") {
            throw new Error("Invalid message");
        }
        const trimmed = record.message.trim().slice(0, 255);
        return { ...record, message: trimmed };
    }
}
exports.MessageTrimmer = MessageTrimmer;
