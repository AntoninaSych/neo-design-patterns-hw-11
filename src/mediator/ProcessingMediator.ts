import { DataRecord } from "../models/DataRecord";
import { AccessLogWriter } from "./writers/AccessLogWriter";
import { TransactionWriter } from "./writers/TransactionWriter";
import { ErrorLogWriter } from "./writers/ErrorLogWriter";
import { RejectedWriter } from "./writers/RejectedWriter";

// Central mediator that routes processed records to appropriate writers
// and captures rejected ones.
export class ProcessingMediator {
  private accessLogWriter = new AccessLogWriter();
  private transactionWriter = new TransactionWriter();
  private errorWriter = new ErrorLogWriter();
  private rejectedWriter = new RejectedWriter();

  private loaded = 0;
  private success = 0;
  private rejected = 0;

  incLoaded(count = 1) {
    this.loaded += count;
  }

  onSuccess(record: DataRecord): void {
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
          amount: Number((record as any).amount),
          currency: (record as any).currency,
        });
        break;
      case "system_error":
        this.errorWriter.write({
          timestamp: record.timestamp,
          level: (record as any).level,
          message: (record as any).message,
        });
        break;
    }
    this.success += 1;
  }

  onRejected(original: DataRecord, error: string): void {
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
    } else {
      console.log(`[INFO] Відхилено з помилками: 0`);
    }
    console.log(`[INFO] Звіт збережено у директорії output/`);
  }
}
