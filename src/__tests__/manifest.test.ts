import { describe, it, expect } from 'vitest';
import { CompleteRegistry } from '../core/registry.js';
import type { HttpStatusMetadata } from '../core/types.js';

const ALL_CODES = Object.keys(CompleteRegistry)
  .map((k) => Number(k))
  .sort((a, b) => a - b);

const hasShape = (entry: HttpStatusMetadata): void => {
  expect(typeof entry.code).toBe('number');
  expect(typeof entry.phrase).toBe('string');
  expect(entry.phrase.length).toBeGreaterThan(0);
  expect([
    'Informational',
    'Success',
    'Redirection',
    'Client Error',
    'Server Error',
    'Vendor Extension',
  ]).toContain(entry.category);
  expect(['IANA', 'Cloudflare', 'Nginx']).toContain(entry.source);
  expect(typeof entry.specUrl).toBe('string');
  expect(entry.specUrl.startsWith('http')).toBe(true);
  expect(typeof entry.description).toBe('string');
  expect(entry.description.length).toBeGreaterThan(0);
  expect(typeof entry.expectsEmptyBody).toBe('boolean');
  expect(typeof entry.requiresAuth).toBe('boolean');
  expect(typeof entry.deprecated).toBe('boolean');
  expect(Array.isArray(entry.relatedHeaders)).toBe(true);
  expect(Array.isArray(entry.aliases)).toBe(true);
  expect(entry.guidance).toBeDefined();
  expect(typeof entry.guidance.isRetryable).toBe('boolean');
  expect([
    'never',
    'immediate',
    'exponential-backoff',
    'respect-retry-after',
  ]).toContain(entry.guidance.retryStrategy);
  expect(typeof entry.guidance.agentAction).toBe('string');
  expect(entry.guidance.agentAction.length).toBeGreaterThan(0);
  expect(Array.isArray(entry.guidance.commonCauses)).toBe(true);
  expect(Array.isArray(entry.guidance.relatedStatuses)).toBe(true);
};

describe('manifest — every CompleteRegistry entry has full HttpStatusMetadata shape', () => {
  it.each(ALL_CODES)('code %i has valid metadata', (code) => {
    const entry = CompleteRegistry[code];
    expect(entry).toBeDefined();
    expect(entry!.code).toBe(code);
    hasShape(entry!);
  });

  it('every entry has a non-empty specUrl', () => {
    for (const code of ALL_CODES) {
      const entry = CompleteRegistry[code]!;
      expect(entry.specUrl.length, `code ${code} has empty specUrl`).toBeGreaterThan(0);
    }
  });

  it('serializes to JSON with sorted keys and stable shape', () => {
    const sorted: Record<string, HttpStatusMetadata> = {};
    for (const code of ALL_CODES) {
      sorted[String(code)] = CompleteRegistry[code]!;
    }
    const json = JSON.stringify(sorted, null, 2);
    const reparsed = JSON.parse(json) as Record<string, HttpStatusMetadata>;
    const reparsedKeys = Object.keys(reparsed).map(Number);
    expect(reparsedKeys).toEqual(ALL_CODES);
  });
});
