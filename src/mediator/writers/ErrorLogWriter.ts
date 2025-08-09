import * as fs from "fs/promises";

export class ErrorLogWriter {
  private lines: string[] = [];

  write(record: any) {
    this.lines.push(JSON.stringify(record));
  }

  async finalize() {
    await fs.mkdir("output", { recursive: true });
    const content = this.lines.join("\n");
    await fs.writeFile("output/errors.jsonl", content + (content ? "\n" : ""), "utf-8");
  }
}
