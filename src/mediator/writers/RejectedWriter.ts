import * as fs from "fs/promises";

export interface RejectedRow {
  record: any;
  error: string;
}

export class RejectedWriter {
  private lines: string[] = [];

  write(row: RejectedRow) {
    this.lines.push(JSON.stringify(row));
  }

  async finalize() {
    await fs.mkdir("output", { recursive: true });
    const content = this.lines.join("\n");
    await fs.writeFile("output/rejected.jsonl", content + (content ? "\n" : ""), "utf-8");
  }
}
