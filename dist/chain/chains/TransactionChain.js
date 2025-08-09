"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTransactionChain = buildTransactionChain;
const TimestampParser_1 = require("../handlers/TimestampParser");
const AmountParser_1 = require("../handlers/AmountParser");
const CurrencyNormalizer_1 = require("../handlers/CurrencyNormalizer");
function buildTransactionChain() {
    // Order matters: timestamp -> amount -> currency
    const ts = new TimestampParser_1.TimestampParser();
    const amount = new AmountParser_1.AmountParser();
    const currency = new CurrencyNormalizer_1.CurrencyNormalizer();
    ts.setNext(amount).setNext(currency);
    return ts;
}
