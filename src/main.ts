import * as fs from "fs/promises";
import * as path from "path";
import {
  DataRecord,
  RecordType,
} from "./models/DataRecord";
import { AbstractHandler } from "./chain/AbstractHandler";
import { buildAccessLogChain } from "./chain/chains/AccessLogChain";
import { buildTransactionChain } from "./chain/chains/TransactionChain";
import { buildSystemErrorChain } from "./chain/chains/SystemErrorChain";
import { ProcessingMediator } from "./mediator/ProcessingMediator";

// Map type -> chain builder (all return AbstractHandler without generics)
const handlerMap: Record<RecordType, () => AbstractHandler> = {
  access_log: buildAccessLogChain,
  transaction: buildTransactionChain,
  system_error: buildSystemErrorChain,
};

// Resolves path relative to the file's directory (src/)
function resolveFromSrc(relative: string) {
  return path.resolve(__dirname, relative);
}

async function loadRecords(absPath: string): Promise<DataRecord[]> {
  const raw = await fs.readFile(absPath, "utf-8");
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr)) throw new Error("records.json must contain an array");
  return arr as DataRecord[];
}

async function main() {
  try {
    const mediator = new ProcessingMediator();

    // default: ./src/data/records.json (relative to src/)
    const inputPath =
        process.argv.find((a) => a.startsWith("--input="))?.split("=", 2)[1] ??
        resolveFromSrc("data/records.json");

    const records = await loadRecords(inputPath);
    mediator.incLoaded(records.length);

    for (const original of records) {
      try {
        if (!original?.type) {
          throw new Error("Missing required field 'type'");
        }
        const build = handlerMap[original.type as RecordType];
        if (!build) {
          throw new Error(`Unsupported type '${(original as any).type}'`);
        }

        const handler = build(); // AbstractHandler (non-generic)
        const processed = handler.handle(original as any); // handle(record:any):any
        mediator.onSuccess(processed as DataRecord);
      } catch (err: any) {
        mediator.onRejected(original as DataRecord, err?.message ?? "Unknown error");
      }
    }

    await mediator.finalize();
    mediator.printSummary();
  } catch (e: any) {
    console.error("[FATAL]", e?.message ?? e);
    process.exitCode = 1;
  }
}

main();
