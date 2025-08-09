"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingMediator = void 0;
const AccessLogWriter_1 = require("./writers/AccessLogWriter");
const TransactionWriter_1 = require("./writers/TransactionWriter");
const ErrorLogWriter_1 = require("./writers/ErrorLogWriter");
const RejectedWriter_1 = require("./writers/RejectedWriter");
// Central mediator that routes processed records to appropriate writers
// and captures rejected ones.
class ProcessingMediator {
    constructor() {
        this.accessLogWriter = new AccessLogWriter_1.AccessLogWriter();
        this.transactionWriter = new TransactionWriter_1.TransactionWriter();
        this.errorWriter = new ErrorLogWriter_1.ErrorLogWriter();
        this.rejectedWriter = new RejectedWriter_1.RejectedWriter();
        this.loaded = 0;
        this.success = 0;
        this.rejected = 0;
    }
    incLoaded(count = 1) {
        this.loaded += count;
    }
    onSuccess(record) {
        switch (record.type) {
            case "access_log":
                this.accessLogWriter.write({
                    timestamp: record.timestamp,
                    userId: record.userId,
                    ip: record.ip,
                });
                break;
            case "transaction":
                this.transactionWriter.write({
                    timestamp: record.timestamp,
                    amount: Number(record.amount),
                    currency: record.currency,
                });
                break;
            case "system_error":
                this.errorWriter.write({
                    timestamp: record.timestamp,
                    level: record.level,
                    message: record.message,
                });
                break;
        }
        this.success += 1;
    }
    onRejected(original, error) {
        this.rejectedWriter.write({ record: original, error });
        this.rejected += 1;
    }
    async finalize() {
        await Promise.all([
            this.accessLogWriter.finalize(),
            this.transactionWriter.finalize(),
            this.errorWriter.finalize(),
            this.rejectedWriter.finalize(),
        ]);
    }
    // Simple console report.
    printSummary() {
        console.log(`[INFO] Завантажено записів: ${this.loaded}`);
        console.log(`[INFO] Успішно оброблено: ${this.success}`);
        if (this.rejected > 0) {
            console.log(`[WARN] Відхилено з помилками: ${this.rejected}`);
        }
        else {
            console.log(`[INFO] Відхилено з помилками: 0`);
        }
        console.log(`[INFO] Звіт збережено у директорії output/`);
    }
}
exports.ProcessingMediator = ProcessingMediator;
