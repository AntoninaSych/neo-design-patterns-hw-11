"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyNormalizer = void 0;
const AbstractHandler_1 = require("../AbstractHandler");
// Uppercases currency; optionally enforce 3-char ISO code length.
class CurrencyNormalizer extends AbstractHandler_1.AbstractHandler {
    process(record) {
        if (typeof record.currency !== "string" || record.currency.trim() === "") {
            throw new Error("Missing currency");
        }
        const currency = record.currency.trim().toUpperCase();
        if (currency.length !== 3) {
            // If strict ISO needed; spec hints ISO-format so we enforce length=3.
            throw new Error("Invalid currency format");
        }
        return { ...record, currency };
    }
}
exports.CurrencyNormalizer = CurrencyNormalizer;
