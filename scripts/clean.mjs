import { rmSync } from "node:fs";

const paths = ["./dist", "./site/dist"];

for (const p of paths) {
  try {
    rmSync(p, { recursive: true, force: true });
  } catch (err) {
    console.error(`Failed to remove ${p}:`, err);
    process.exitCode = 1;
  }
}
