"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimestampParser = void 0;
const AbstractHandler_1 = require("../AbstractHandler");
class TimestampParser extends AbstractHandler_1.AbstractHandler {
    process(record) {
        if (!record.timestamp)
            throw new Error("Missing timestamp");
        const d = new Date(record.timestamp);
        if (Number.isNaN(d.getTime()))
            throw new Error("Invalid timestamp");
        const normalized = d.toISOString();
        return { ...record, timestamp: normalized };
    }
}
exports.TimestampParser = TimestampParser;
