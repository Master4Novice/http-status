import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CompleteRegistry } from '../src/core/registry.js';
import type { HttpStatusMetadata } from '../src/core/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const outputPath = path.join(distDir, 'http-status-registry.json');

if (!fs.existsSync(distDir)) {
  console.error(`[build-manifest] dist/ does not exist yet. Run "tsup" first.`);
  process.exit(1);
}

const codes = Object.keys(CompleteRegistry)
  .map((k) => Number(k))
  .sort((a, b) => a - b);

const sorted: Record<string, HttpStatusMetadata> = {};
for (const code of codes) {
  const entry = CompleteRegistry[code];
  if (!entry) {
    console.error(`[build-manifest] missing entry for declared code ${code}.`);
    process.exit(1);
  }
  if (entry.code !== code) {
    console.error(
      `[build-manifest] drift: registry key ${code} but entry.code = ${entry.code}.`,
    );
    process.exit(1);
  }
  sorted[String(code)] = entry;
}

fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
console.log(
  `[build-manifest] wrote ${codes.length} status entries to ${path.relative(projectRoot, outputPath)}`,
);
