import * as fs from "fs/promises";

// Buffers rows then writes CSV with header on finalize.
export class TransactionWriter {
  private rows: Array<{ timestamp: string; amount: number; currency: string }> =
      [];

  write(record: { timestamp: string; amount: number; currency: string }) {
    this.rows.push(record);
  }

  async finalize() {
    await fs.mkdir("output", { recursive: true });
    const header = "timestamp,amount,currency";
    const body = this.rows
        .map((r) => `${r.timestamp},${r.amount},${r.currency}`)
        .join("\n");
    const csv = [header, body].filter(Boolean).join("\n");
    await fs.writeFile("output/transactions.csv", csv, "utf-8");
  }
}
