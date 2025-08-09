import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

/** Trims message and cuts to 255 chars for system_error records. */
export default class MessageTrimmer extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type !== "system_error") return record;

    const msg = (record as any).message;
    if (typeof msg !== "string") {
      throw new Error("Invalid message");
    }
    const trimmed = msg.trim().slice(0, 255);
    return { ...record, message: trimmed };
  }
}
