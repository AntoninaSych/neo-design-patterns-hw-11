import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

const IPv4 =
    /^(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})$/;

/** Basic IPv4 validation for access_log records. */
export default class IpValidator extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (record.type !== "access_log") return record;

    const { ip } = record;
    if (typeof ip !== "string" || !IPv4.test(ip)) {
      throw new Error("Invalid ip");
    }
    return record;
  }
}
