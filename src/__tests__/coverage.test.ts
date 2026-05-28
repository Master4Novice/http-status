import { describe, it, expect } from 'vitest';
import { IanaStatus, IanaRegistry } from '../iana/index.js';
import { CloudflareStatus, CloudflareRegistry } from '../cloudflare/index.js';
import { NginxStatus, NginxRegistry } from '../nginx/index.js';
import { CompleteRegistry } from '../core/registry.js';

const IANA_COUNT = 62;
const CLOUDFLARE_COUNT = 9;
const NGINX_COUNT = 6;
const TOTAL_COUNT = IANA_COUNT + CLOUDFLARE_COUNT + NGINX_COUNT;

describe('coverage — declared codes match registry entries', () => {
  it('IanaStatus declares exactly the expected number of codes', () => {
    expect(Object.keys(IanaStatus)).toHaveLength(IANA_COUNT);
  });

  it('IanaRegistry has an entry for every IanaStatus value, with matching code', () => {
    const reg = IanaRegistry as unknown as Record<number, { code: number }>;
    for (const [name, code] of Object.entries(IanaStatus as Record<string, number>)) {
      const entry = reg[code];
      expect(entry, `IanaRegistry missing entry for ${name} (${code})`).toBeDefined();
      expect(entry.code).toBe(code);
    }
  });

  it('IanaRegistry has no codes not declared in IanaStatus', () => {
    const declared = new Set<number>(Object.values(IanaStatus));
    for (const key of Object.keys(IanaRegistry)) {
      expect(declared.has(Number(key))).toBe(true);
    }
  });

  it('CloudflareStatus declares exactly the expected number of codes', () => {
    expect(Object.keys(CloudflareStatus)).toHaveLength(CLOUDFLARE_COUNT);
  });

  it('CloudflareRegistry has an entry for every CloudflareStatus value, with matching code', () => {
    const reg = CloudflareRegistry as unknown as Record<number, { code: number }>;
    for (const [name, code] of Object.entries(CloudflareStatus as Record<string, number>)) {
      const entry = reg[code];
      expect(entry, `CloudflareRegistry missing entry for ${name} (${code})`).toBeDefined();
      expect(entry.code).toBe(code);
    }
  });

  it('NginxStatus declares exactly the expected number of codes', () => {
    expect(Object.keys(NginxStatus)).toHaveLength(NGINX_COUNT);
  });

  it('NginxRegistry has an entry for every NginxStatus value, with matching code', () => {
    const reg = NginxRegistry as unknown as Record<number, { code: number }>;
    for (const [name, code] of Object.entries(NginxStatus as Record<string, number>)) {
      const entry = reg[code];
      expect(entry, `NginxRegistry missing entry for ${name} (${code})`).toBeDefined();
      expect(entry.code).toBe(code);
    }
  });

  it('CompleteRegistry aggregates every declared code exactly once', () => {
    expect(Object.keys(CompleteRegistry)).toHaveLength(TOTAL_COUNT);
  });
});
