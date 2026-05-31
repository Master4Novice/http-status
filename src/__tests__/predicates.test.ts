import { describe, it, expect } from 'vitest';
import {
  isInformational,
  isSuccess,
  isRedirection,
  isClientError,
  isServerError,
  isError,
  isRetryable,
  hasEmptyBody,
  isCacheable,
  cacheability,
  requiresAuth,
} from '../utils/index.js';
import { getMetadata } from '../core/registry.js';

describe('range predicates', () => {
  it.each([
    [100, true, false, false, false, false, false],
    [199, true, false, false, false, false, false],
    [200, false, true, false, false, false, false],
    [299, false, true, false, false, false, false],
    [300, false, false, true, false, false, false],
    [399, false, false, true, false, false, false],
    [400, false, false, false, true, false, true],
    [499, false, false, false, true, false, true],
    [500, false, false, false, false, true, true],
    [599, false, false, false, false, true, true],
  ])(
    'code %i → informational=%s success=%s redirection=%s clientError=%s serverError=%s error=%s',
    (code, inf, suc, red, cli, ser, err) => {
      expect(isInformational(code)).toBe(inf);
      expect(isSuccess(code)).toBe(suc);
      expect(isRedirection(code)).toBe(red);
      expect(isClientError(code)).toBe(cli);
      expect(isServerError(code)).toBe(ser);
      expect(isError(code)).toBe(err);
    },
  );
});

describe('isRetryable', () => {
  it.each([
    [100, false],
    [200, false],
    [301, false],
    [400, false],
    [401, false],
    [403, false],
    [404, false],
    [408, true],
    [409, false],
    [422, false],
    [425, true],
    [426, true],
    [429, true],
    [500, true],
    [501, false],
    [502, true],
    [503, true],
    [504, true],
    [505, false],
    [520, true],
    [525, false],
    [600, false],
    [408 + 1000, false],
  ])('code %i → %s', (code, expected) => {
    expect(isRetryable(code)).toBe(expected);
  });
});

describe('hasEmptyBody', () => {
  it.each([
    [100, true],
    [103, true],
    [200, false],
    [204, true],
    [205, true],
    [304, true],
    [400, false],
    [444, true],
    [499, true],
    [600, false],
  ])('code %i → %s', (code, expected) => {
    expect(hasEmptyBody(code)).toBe(expected);
  });
});

describe('isCacheable', () => {
  it.each<[number, boolean]>([
    [200, true],
    [201, false],
    [204, true],
    [301, true],
    [302, false],
    [308, true],
    [404, true],
    [410, true],
    [500, false],
    [600, false],
  ])('code %i → %s', (code, expected) => {
    expect(isCacheable(code)).toBe(expected);
  });
});

describe('cacheability', () => {
  it.each<[number, 'heuristic' | 'uncacheable']>([
    [200, 'heuristic'],
    [201, 'uncacheable'],
    [301, 'heuristic'],
    [302, 'uncacheable'],
    [500, 'uncacheable'],
  ])('code %i → %s', (code, expected) => {
    expect(cacheability(code)).toBe(expected);
  });

  it('agrees with isCacheable', () => {
    for (const code of [200, 201, 204, 302, 404, 500, 600]) {
      expect(cacheability(code) === 'heuristic').toBe(isCacheable(code));
    }
  });
});

describe('requiresAuth', () => {
  it.each([
    [200, false],
    [401, true],
    [403, false],
    [407, true],
    [496, true],
    [511, true],
    [600, false],
  ])('code %i → %s', (code, expected) => {
    expect(requiresAuth(code)).toBe(expected);
  });
});

describe('getMetadata', () => {
  it('returns full metadata for a known code', () => {
    const meta = getMetadata(429);
    expect(meta).toBeDefined();
    expect(meta?.code).toBe(429);
    expect(meta?.phrase).toBe('Too Many Requests');
    expect(meta?.guidance.retryStrategy).toBe('respect-retry-after');
    expect(meta?.guidance.isRetryable).toBe(true);
  });

  it('returns undefined for an unknown code', () => {
    expect(getMetadata(699)).toBeUndefined();
  });
});
