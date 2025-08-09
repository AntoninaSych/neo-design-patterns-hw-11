import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

/** Ensures userId is a non-empty string for access_log records. */
export default class UserIdValidator extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type !== "access_log") return record;

    const { userId } = record;
    if (typeof userId !== "string" || userId.trim().length === 0) {
      throw new Error("Invalid userId");
    }
    return { ...record, userId: userId.trim() };
  }
}
