import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

/** Parses amount to number for transaction records. */
export default class AmountParser extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type !== "transaction") return record;

    const raw = record.amount as any;
    const amount = typeof raw === "string" ? parseFloat(raw) : raw;
    if (typeof amount !== "number" || Number.isNaN(amount)) {
      throw new Error("Invalid amount");
    }
    return { ...record, amount };
  }
}
