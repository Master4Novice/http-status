/**
 * Pure, data-free predicates. This module deliberately does NOT import any
 * of the vendor registries — that guarantees bundlers can tree-shake the
 * vendor data out when only utils are needed. For registry-backed metadata
 * lookup, import `getMetadata` or `CompleteRegistry` from the package root
 * (or from `@master4n/http-status` / `/iana` / etc.).
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

/**
 * Returns the cacheability classification per RFC 9111 §4.2.2. The codes
 * enumerated there are "heuristically cacheable"; all other codes are not
 * cacheable by default.
 */
export const isCacheable = (code: number): boolean | 'heuristic' =>
  CACHEABLE_HEURISTIC_CODES.has(code) ? 'heuristic' : false;

const AUTH_REQUIRED_CODES = new Set<number>([401, 407, 496, 511]);

/**
 * Returns true when the status mandates an authentication challenge (401,
 * 407, Nginx 496, 511).
 */
export const requiresAuth = (code: number): boolean => AUTH_REQUIRED_CODES.has(code);
