/**
 * Pure, data-free predicates. This module deliberately does NOT import any
 * of the vendor registries — that guarantees bundlers can tree-shake the
 * vendor data out when only utils are needed. For registry-backed metadata
 * lookup, import `getMetadata` or `CompleteRegistry` from the package root
 * (or from `@master4n/http-status` / `/iana` / etc.).
 *
 * Input contract: every predicate expects a real HTTP status code — a finite
 * integer, typically 100–599. They are intentionally branch-free and do **not**
 * validate the domain, so out-of-range or non-integer inputs return a defined
 * but meaningless result (e.g. `isError(999) === true`, `isError(NaN) === false`).
 * Validate untrusted input before calling, or use `getMetadata(code)` (returns
 * `undefined` for unknown codes) when you need to know a code is real.
 */

export const isInformational = (code: number): boolean => code >= 100 && code < 200;
export const isSuccess = (code: number): boolean => code >= 200 && code < 300;
export const isRedirection = (code: number): boolean => code >= 300 && code < 400;
export const isClientError = (code: number): boolean => code >= 400 && code < 500;
export const isServerError = (code: number): boolean => code >= 500 && code < 600;
export const isError = (code: number): boolean => code >= 400;

const RETRYABLE_CODES = new Set<number>([
  408, 421, 425, 426, 429,
  500, 502, 503, 504, 507, 511,
  520, 521, 522, 523, 524, 527, 530,
  497,
]);

/**
 * Returns true when the status is generally safe to retry. Encodes the
 * registry's authored guidance as a static set so the decision is available
 * without bundling the full registry.
 */
export const isRetryable = (code: number): boolean => RETRYABLE_CODES.has(code);

const EMPTY_BODY_CODES = new Set<number>([204, 205, 304, 444, 499]);

/**
 * Returns true when the response body MUST be empty per RFC 9110 / RFC 9111
 * (1xx, 204, 205, 304) or per vendor convention (Nginx 444, 499).
 */
export const hasEmptyBody = (code: number): boolean =>
  isInformational(code) || EMPTY_BODY_CODES.has(code);

const CACHEABLE_HEURISTIC_CODES = new Set<number>([
  200, 203, 204, 206, 226, 300, 301, 308, 404, 405, 410, 414, 501,
]);

import type { Cacheability } from '../core/types.js';
export type { Cacheability } from '../core/types.js';

/**
 * Precise cacheability classification per RFC 9111 §4.2.2. Returns `'heuristic'`
 * for the status codes that a cache MAY store without explicit freshness
 * headers, and `'uncacheable'` for everything else. (No status code is
 * unconditionally cacheable on its own — explicit `Cache-Control`/`Expires`
 * headers always govern; this classifies what is cacheable by *status alone*.)
 *
 * @example
 * cacheability(200); // 'heuristic'
 * cacheability(500); // 'uncacheable'
 */
export const cacheability = (code: number): Cacheability =>
  CACHEABLE_HEURISTIC_CODES.has(code) ? 'heuristic' : 'uncacheable';

/**
 * Boolean predicate: `true` when the status code is heuristically cacheable per
 * RFC 9111 §4.2.2 (cacheable by status alone, without explicit freshness
 * headers). For the precise classification, use {@link cacheability}.
 *
 * @remarks Changed in 2.0.1: previously returned `boolean | 'heuristic'` (the
 * string `'heuristic'` or `false`). It now returns a plain `boolean`, consistent
 * with the other `is*` predicates; use {@link cacheability} for the string form.
 */
export const isCacheable = (code: number): boolean =>
  CACHEABLE_HEURISTIC_CODES.has(code);

const AUTH_REQUIRED_CODES = new Set<number>([401, 407, 496, 511]);

/**
 * Returns true when the status mandates an authentication challenge (401,
 * 407, Nginx 496, 511).
 */
export const requiresAuth = (code: number): boolean => AUTH_REQUIRED_CODES.has(code);
