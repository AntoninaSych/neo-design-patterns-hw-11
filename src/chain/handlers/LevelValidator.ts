import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

const allowed = new Set(["info", "warning", "critical"] as const);

/** Validates error level for system_error records. */
export default class LevelValidator extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type !== "system_error") return record;

    const lvl = (record as any).level;
    if (!allowed.has(lvl)) throw new Error("Invalid level");
    return record;
  }
}
