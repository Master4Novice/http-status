export type HttpStatusCategory =
  | 'Informational'
  | 'Success'
  | 'Redirection'
  | 'Client Error'
  | 'Server Error'
  | 'Vendor Extension';

export type HttpStatusSource = 'IANA' | 'Cloudflare' | 'Nginx';

export type HttpMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'CONNECT'
  | 'TRACE';

export type RetryStrategy =
  | 'never'
  | 'immediate'
  | 'exponential-backoff'
  | 'respect-retry-after';

/**
 * Cacheability classification by status code alone, per RFC 9111 §4.2.2.
 * `'heuristic'`: a cache MAY store the response without explicit freshness
 * headers. `'uncacheable'`: not cacheable by status alone (explicit
 * `Cache-Control`/`Expires` headers may still apply).
 */
export type Cacheability = 'heuristic' | 'uncacheable';

export interface RelatedHeader {
  readonly name: string;
  readonly required: boolean;
  readonly purpose: string;
}

/**
 * Authored guidance. NOT derived from the spec. Treat as recommendation, not normative fact.
 */
export interface HttpStatusGuidance {
  readonly isRetryable: boolean;
  readonly retryStrategy: RetryStrategy;
  readonly agentAction: string;
  readonly commonCauses: readonly string[];
  readonly relatedStatuses: readonly number[];
}

/**
 * Spec-derivable metadata. Every field is backed by `specUrl`.
 */
export interface HttpStatusMetadata {
  readonly code: number;
  readonly phrase: string;
  readonly category: HttpStatusCategory;
  readonly source: HttpStatusSource;
  readonly rfc: string | null;
  readonly specUrl: string;
  readonly description: string;
  readonly expectsEmptyBody: boolean;
  /**
   * Cacheability by status alone, per RFC 9111 §4.2.2: `'heuristic'` if a cache
   * MAY store the response without explicit freshness headers, else
   * `'uncacheable'`. (Renamed from `isCacheable: boolean | 'heuristic'` in 2.0.1
   * for a clean string enum; the `isCacheable()` predicate in `/utils` still
   * exists and returns a boolean.)
   */
  readonly cacheability: Cacheability;
  readonly requiresAuth: boolean;
  readonly safeForMethods: readonly HttpMethod[] | 'all';
  readonly relatedHeaders: readonly RelatedHeader[];
  readonly aliases: readonly string[];
  readonly deprecated: boolean;
  readonly guidance: HttpStatusGuidance;
}

export type HttpStatusRegistryMap = Readonly<Record<number, HttpStatusMetadata>>;
