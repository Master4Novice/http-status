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
  readonly isCacheable: boolean | 'heuristic';
  readonly requiresAuth: boolean;
  readonly safeForMethods: readonly HttpMethod[] | 'all';
  readonly relatedHeaders: readonly RelatedHeader[];
  readonly aliases: readonly string[];
  readonly deprecated: boolean;
  readonly guidance: HttpStatusGuidance;
}

export type HttpStatusRegistryMap = Readonly<Record<number, HttpStatusMetadata>>;
