# @master4n/http-status

![Owner](https://img.shields.io/badge/Owner-Master4Novice-orange?style=flat)
![License](https://img.shields.io/npm/l/%40master4n%2Fhttp-status)
![Downloads](https://img.shields.io/npm/dm/%40master4n%2Fhttp-status)

**The machine-readable HTTP status registry, optimised for AI agents and RAG pipelines.**

Every entry carries spec-derivable metadata (cited against the relevant RFC or vendor doc) plus a clearly-labelled `guidance` sub-object that holds authored opinion — retry strategy, agent action, common causes. Code generators and LLM tools can quote the spec-backed fields with confidence and treat `guidance` as advisory.

---

## For AI agents

- **Static JSON registry (no install required):**
  - https://unpkg.com/@master4n/http-status@2/http-status-registry.json
  - https://cdn.jsdelivr.net/npm/@master4n/http-status@2/http-status-registry.json
- **Discovery file:** https://unpkg.com/@master4n/http-status@2/llms.txt
- **Subpath imports:** `@master4n/http-status/iana`, `/cloudflare`, `/nginx`, `/utils`.
- **Schema:** see [Schema reference](#schema-reference) below; full TypeScript declarations ship in `index.d.ts`.

> The `guidance` sub-object on every entry is authored opinion, not spec. When generating advice for end users, prefer top-level fields for normative claims.

---

## Installation

```sh
npm install @master4n/http-status
```

Zero runtime dependencies. Dual ESM/CommonJS builds. Tree-shakable via per-vendor sub-paths.

---

## Quickstart

```ts
import { IanaStatus, IanaRegistry } from '@master4n/http-status/iana';
import { isRetryable, hasEmptyBody } from '@master4n/http-status/utils';

// Status code constants
IanaStatus.TOO_MANY_REQUESTS;            // 429
IanaStatus.OK;                            // 200

// Full metadata
const meta = IanaRegistry[429];
meta.phrase;                              // "Too Many Requests"
meta.rfc;                                 // "RFC6585"
meta.specUrl;                             // "https://datatracker.ietf.org/doc/html/rfc6585#section-4"
meta.guidance.retryStrategy;              // "respect-retry-after"
meta.guidance.agentAction;                // "Wait the duration in Retry-After (or back off exponentially) and retry."

// Predicates
isRetryable(503);                         // true
hasEmptyBody(204);                        // true
```

---

## Tree-shakable sub-paths

| Sub-path                            | What it exports                                                              |
|-------------------------------------|------------------------------------------------------------------------------|
| `@master4n/http-status`             | Everything (types, predicates, all registries, `CompleteRegistry`).          |
| `@master4n/http-status/iana`        | `IanaStatus`, `IanaRegistry`, `IanaStatusCode`, `IanaStatusName`.            |
| `@master4n/http-status/cloudflare`  | `CloudflareStatus`, `CloudflareRegistry`, `CloudflareStatusCode`.            |
| `@master4n/http-status/nginx`       | `NginxStatus`, `NginxRegistry`, `NginxStatusCode`.                            |
| `@master4n/http-status/utils`       | Pure predicates only (no registry data). For `getMetadata`, import from the root. |
| `@master4n/http-status/registry.json` | The full pre-built JSON registry.                                          |

---

## Predicate cookbook

```ts
import {
  isInformational, isSuccess, isRedirection, isClientError, isServerError, isError,
  isRetryable, hasEmptyBody, isCacheable, requiresAuth,
} from '@master4n/http-status/utils';
import { getMetadata } from '@master4n/http-status';

// Retry decision with respect-Retry-After semantics
async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  const res = await fetch(url);
  if (res.ok || !isRetryable(res.status) || attempts <= 0) return res;

  const meta = getMetadata(res.status);
  const retryAfter = res.headers.get('Retry-After');
  const delayMs =
    meta?.guidance.retryStrategy === 'respect-retry-after' && retryAfter
      ? Number(retryAfter) * 1000
      : 2 ** (3 - attempts) * 500;

  await new Promise((r) => setTimeout(r, delayMs));
  return fetchWithRetry(url, attempts - 1);
}
```

---

## Schema reference

Every entry in every registry conforms to `HttpStatusMetadata`:

```ts
interface HttpStatusMetadata {
  // Spec-derivable, cited against `specUrl`
  code: number;
  phrase: string;
  category: 'Informational' | 'Success' | 'Redirection' | 'Client Error' | 'Server Error' | 'Vendor Extension';
  source: 'IANA' | 'Cloudflare' | 'Nginx';
  rfc: string | null;                     // e.g. "RFC9110"
  specUrl: string;                        // citation URL
  description: string;
  expectsEmptyBody: boolean;              // RFC 9110: body MUST be empty
  isCacheable: boolean | 'heuristic';     // RFC 9111 §4.2.2
  requiresAuth: boolean;
  safeForMethods: HttpMethod[] | 'all';
  relatedHeaders: { name: string; required: boolean; purpose: string }[];
  aliases: string[];
  deprecated: boolean;

  // Authored guidance — NOT spec. Treat as recommendation.
  guidance: {
    isRetryable: boolean;
    retryStrategy: 'never' | 'immediate' | 'exponential-backoff' | 'respect-retry-after';
    agentAction: string;
    commonCauses: string[];
    relatedStatuses: number[];
  };
}
```

---

## Coverage

| Source      | Codes covered                                                                                                                                                                                                          | Count |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| IANA        | 100–103, 200–208, 226, 300–305, 307, 308, 400–418, 421–426, 428, 429, 431, 451, 500–508, 510, 511                                                                                                                       | 62    |
| Cloudflare  | 520, 521, 522, 523, 524, 525, 526, 527, 530                                                                                                                                                                            | 9     |
| Nginx       | 444, 494, 495, 496, 497, 499                                                                                                                                                                                           | 6     |

---

## Migration from v1

v2.0.0 is a hard break. The v1 `HttpStatus` class is gone. See [CHANGELOG.md](./CHANGELOG.md) for the one-to-one mapping. The new API gives you full metadata in exchange for the rename.

```ts
// v1
HttpStatus.OK.value;           // 200
HttpStatus.OK.name;            // 'OK'
HttpStatus.valueOf(200);       // ['OK']

// v2
IanaStatus.OK;                 // 200
IanaRegistry[200].phrase;      // 'OK'
IanaRegistry[200];             // full metadata (RFC, retry strategy, agent action, …)
```

---

## License

MIT © Master4Novice
