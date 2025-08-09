import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

/** Uppercases currency and enforces 3-letter ISO format for transaction records. */
export default class CurrencyNormalizer extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type !== "transaction") return record;

    const raw = (record as any).currency;
    if (typeof raw !== "string" || raw.trim() === "") {
      throw new Error("Missing currency");
    }
    const currency = raw.trim().toUpperCase();
    if (currency.length !== 3) throw new Error("Invalid currency format");
    return { ...record, currency };
  }
}
