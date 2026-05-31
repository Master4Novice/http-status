# Changelog

## 2.0.1

API consistency for cacheability. (Released as a patch, but note the type changes
below are technically breaking for code that read the old shapes.)

### Changed

- **`isCacheable(code)` now returns a plain `boolean`** (was `boolean | 'heuristic'`).
  It returns `true` for heuristically-cacheable codes, consistent with the other
  `is*` predicates. Code doing `isCacheable(c) === 'heuristic'` should switch to
  the new `cacheability()` function.
- **Metadata field `isCacheable` renamed to `cacheability`** with a clean string
  enum: `'heuristic' | 'uncacheable'` (was `boolean | 'heuristic'`, which only ever
  held `'heuristic'` or `false` in practice). Applies to every registry entry and
  to `http-status-registry.json`.

### Added

- **`cacheability(code): 'heuristic' | 'uncacheable'`** — precise RFC 9111 §4.2.2
  classification (the string form of `isCacheable`).
- **`Cacheability` type** exported from the package root and `/utils`.
- Documented the predicate input contract: predicates expect a real status int and
  do not validate the domain (use `getMetadata` to detect unknown codes).

## 2.0.0 — BREAKING

This is a clean break from v1. The library has been repositioned as a machine-readable HTTP status registry optimised for AI agents and RAG pipelines.

### Removed

- The `HttpStatus` class (and its instance shape `{ name, value }`). Methods `HttpStatus.valueOf()` and `HttpStatus.values()` are removed.

### Added

- `IanaStatus`, `CloudflareStatus`, `NginxStatus` — immutable `as const` objects mapping names to numeric codes.
- `IanaRegistry`, `CloudflareRegistry`, `NginxRegistry`, `CompleteRegistry` — `Record<number, HttpStatusMetadata>` with full per-code metadata.
- `HttpStatusMetadata` interface — spec-derivable top-level fields (`code`, `phrase`, `category`, `source`, `rfc`, `specUrl`, `description`, `expectsEmptyBody`, `isCacheable`, `requiresAuth`, `safeForMethods`, `relatedHeaders`, `aliases`, `deprecated`) plus an authored `guidance: {...}` sub-object (`isRetryable`, `retryStrategy`, `agentAction`, `commonCauses`, `relatedStatuses`).
- Predicates in `/utils`: `isInformational`, `isSuccess`, `isRedirection`, `isClientError`, `isServerError`, `isError`, `isRetryable`, `hasEmptyBody`, `isCacheable`, `requiresAuth`, `getMetadata`.
- Tree-shakable sub-paths: `@master4n/http-status/iana`, `/cloudflare`, `/nginx`, `/utils`.
- Pre-built JSON registry at the package root (`./registry.json` export, also reachable via unpkg/jsDelivr CDN URLs).
- `llms.txt` discovery file at the package root.
- Coverage expanded from ~50 to **77 codes** (62 IANA + 9 Cloudflare + 6 Nginx), each cited to an RFC or vendor doc URL.

### Migration

| v1                              | v2                                                            |
|---------------------------------|---------------------------------------------------------------|
| `HttpStatus.OK.value`           | `IanaStatus.OK`                                               |
| `HttpStatus.OK.name`            | `IanaRegistry[IanaStatus.OK].phrase`                          |
| `HttpStatus.valueOf(200)`       | `IanaRegistry[200].phrase` (or `getMetadata(200)?.phrase`)    |
| `HttpStatus.values()`           | `Object.keys(IanaStatus)`                                      |

Import-path changes:

```ts
// v1
import { HttpStatus } from '@master4n/http-status';

// v2
import { IanaStatus, IanaRegistry } from '@master4n/http-status/iana';
import { isRetryable } from '@master4n/http-status/utils';
```

### Build & tooling

- Replaced Rollup with `tsup` for dual ESM/CJS + `.d.ts` emission.
- Added `vitest` for testing (coverage, predicates, manifest, treeshake suites).
- Published from `dist/` as before; the dev `package.json` and the published `package.json` are now distinct (dev has scripts/devDependencies; published has `exports`, `sideEffects: false`, and dist-relative paths).
- Added `prepare-publish.ts` that writes the stripped runtime manifest into `dist/` and copies `README.md`, `LICENSE`, `CHANGELOG.md`, `llms.txt`.
- Added `build-manifest.ts` that writes the sorted JSON registry into `dist/http-status-registry.json`.
