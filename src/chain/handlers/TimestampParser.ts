import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

/** Validates ISO-like timestamp and normalizes to ISO string. */
export default class TimestampParser extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (!record.timestamp) throw new Error("Missing timestamp");
    const d = new Date(record.timestamp);
    if (Number.isNaN(d.getTime())) throw new Error("Invalid timestamp");
    return { ...record, timestamp: d.toISOString() };
  }
}
