"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmountParser = void 0;
const AbstractHandler_1 = require("../AbstractHandler");
class AmountParser extends AbstractHandler_1.AbstractHandler {
    process(record) {
        const amount = typeof record.amount === "string"
            ? parseFloat(record.amount)
            : record.amount;
        if (typeof amount !== "number" || Number.isNaN(amount)) {
            throw new Error("Invalid amount");
        }
        return { ...record, amount };
    }
}
exports.AmountParser = AmountParser;
