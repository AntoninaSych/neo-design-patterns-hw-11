"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const AccessLogChain_1 = require("./chain/chains/AccessLogChain");
const TransactionChain_1 = require("./chain/chains/TransactionChain");
const SystemErrorChain_1 = require("./chain/chains/SystemErrorChain");
const ProcessingMediator_1 = require("./mediator/ProcessingMediator");
// Map type -> chain builder
const handlerMap = {
    access_log: AccessLogChain_1.buildAccessLogChain,
    transaction: TransactionChain_1.buildTransactionChain,
    system_error: SystemErrorChain_1.buildSystemErrorChain,
};
async function loadRecords(path) {
    const raw = await fs.readFile(path, "utf-8");
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr))
        throw new Error("records.json must contain an array");
    return arr;
}
async function main() {
    try {
        const mediator = new ProcessingMediator_1.ProcessingMediator();
        const records = await loadRecords("data/records.json");
        mediator.incLoaded(records.length);
        for (const original of records) {
            try {
                if (!original?.type) {
                    throw new Error("Missing required field 'type'");
                }
                const build = handlerMap[original.type];
                if (!build) {
                    throw new Error(`Unsupported type '${original.type}'`);
                }
                const handler = build();
                const processed = handler.handle(original); // chain may narrow types
                mediator.onSuccess(processed);
            }
            catch (err) {
                mediator.onRejected(original, err?.message ?? "Unknown error");
            }
        }
        await mediator.finalize();
        mediator.printSummary();
    }
    catch (e) {
        console.error("[FATAL]", e?.message ?? e);
        process.exitCode = 1;
    }
}
main();
