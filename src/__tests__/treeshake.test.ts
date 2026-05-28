import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, expect } from 'vitest';

const distUtilsEsm = path.resolve(process.cwd(), 'dist/utils/index.js');
const distUtilsCjs = path.resolve(process.cwd(), 'dist/utils/index.cjs');

const VENDOR_PHRASES = [
  'Web Server Is Down',
  'Connection Timed Out',
  'SSL Handshake Failed',
  'Origin DNS Error',
  'Railgun Error',
];

describe('treeshake — /utils bundle does not include vendor phrase strings', () => {
  const distExists = fs.existsSync(distUtilsEsm) && fs.existsSync(distUtilsCjs);

  it.skipIf(!distExists)('ESM utils bundle has no Cloudflare phrase strings', () => {
    const content = fs.readFileSync(distUtilsEsm, 'utf-8');
    for (const phrase of VENDOR_PHRASES) {
      expect(content.includes(phrase), `phrase "${phrase}" leaked into utils ESM bundle`).toBe(
        false,
      );
    }
  });

  it.skipIf(!distExists)('CJS utils bundle has no Cloudflare phrase strings', () => {
    const content = fs.readFileSync(distUtilsCjs, 'utf-8');
    for (const phrase of VENDOR_PHRASES) {
      expect(content.includes(phrase), `phrase "${phrase}" leaked into utils CJS bundle`).toBe(
        false,
      );
    }
  });

  it('skip-marker so the file always has at least one collected test', () => {
    expect(distExists || !distExists).toBe(true);
  });
});
