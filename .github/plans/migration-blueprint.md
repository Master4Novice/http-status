# Comprehensive Architecture Blueprint & Migration Plan: @master4n/http-status v2.0.0

## 1. Vision & Strategic Positioning

The objective of version `2.0.0` is to transition `@master4n/http-status` from a traditional, flat status-code library into the **definitive, enterprise-grade, single source of truth for HTTP metadata**. 

Modern development workflows are increasingly automated by AI coding agents (e.g., Cursor, GitHub Copilot, Claude Engineer). These agents require structured, predictable, and semantically rich information to generate correct application logic. Traditional status libraries fall short by omitting platform-specific codes, relying on tree-shaking-unfriendly TypeScript enums, or dropping critical contextual metadata (such as whether an error is safe to retry or if it mandates an empty response body).

### Core Pillars of v2.0.0
1. **Zero Runtime Dependencies:** The engine remains completely unburdened by third-party packages, minimizing installation overhead and security surface areas.
2. **Dual ESM/CommonJS Target Support:** Fully compatible across modern bundlers (Vite, Next.js, Rollup) and traditional Node.js/CommonJS runtimes.
3. **Flawless Type Inference:** Eliminates all TypeScript runtime `enum` declarations, replacing them with immutable literal objects (`as const`) to provide clean IDE autocomplete context and exact type constraints.
4. **Platform & Protocol Extensions:** Scopes the standard Internet Assigned Numbers Authority (IANA) library alongside specialized vendor sub-paths for Cloudflare and Nginx.
5. **AI-Agent Machine Readability:** Generates a root-level static database (`http-status-registry.json`) during compilation to support retrieval-augmented generation (RAG) and model scraping contexts.

---

## 2. Directory & Package Topology

The target repository structure must conform to a strict multi-entrypoint layout. The build output directory (`dist/`) should cleanly partition compiled configurations so that sub-paths can be resolved without namespace collisions.

```text
@master4n/http-status/
├── src/
│   ├── core/
│   │   ├── types.ts              # Global type architectures and interfaces
│   │   └── base-registry.ts      # Core registry aggregator
│   ├── iana/
│   │   └── index.ts              # Standard IANA status codes and deep metadata
│   ├── cloudflare/
│   │   └── index.ts              # Cloudflare edge-network status codes
│   ├── nginx/
│   │   └── index.ts              # Nginx web server custom status codes
│   ├── utils/
│   │   └── index.ts              # Predictive semantic helper utilities
│   └── index.ts                  # Main root entrance (Exposes entire surface)
├── scripts/
│   └── build-manifest.ts         # Post-compile JSON metadata exporter
├── package.json                  # Modern package exports matrix
├── tsconfig.json                 # Strict compiler constraints
├── tsup.config.ts                # Dual bundler configuration orchestrator
├── README.md                     # Documentation for human and LLM users
└── plan.md                       # High-level tracking file
```

---

## 3. Configuration & Tooling Overhaul

### 3.1. Production Package Configuration (`package.json`)
The package configuration must enforce explicit conditional exports, routing sub-paths cleanly to their respective compiled bundles in `dist/`.

```json
{
  "name": "@master4n/http-status",
  "version": "2.0.0",
  "description": "The definitive, hyper-optimized single source of truth for standard and vendor-specific HTTP statuses with rich metadata.",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./iana": {
      "types": "./dist/iana/index.d.ts",
      "import": "./dist/iana/index.js",
      "require": "./dist/iana/index.cjs"
    },
    "./cloudflare": {
      "types": "./dist/cloudflare/index.d.ts",
      "import": "./dist/cloudflare/index.js",
      "require": "./dist/cloudflare/index.cjs"
    },
    "./nginx": {
      "types": "./dist/nginx/index.d.ts",
      "import": "./dist/nginx/index.js",
      "require": "./dist/nginx/index.cjs"
    },
    "./utils": {
      "types": "./dist/utils/index.d.ts",
      "import": "./dist/utils/index.js",
      "require": "./dist/utils/index.cjs"
    }
  },
  "files": [
    "dist",
    "http-status-registry.json",
    "README.md"
  ],
  "scripts": {
    "clean": "rimraf dist",
    "prebuild": "npm run clean",
    "build": "tsup && tsx scripts/build-manifest.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "keywords": [
    "http",
    "http-status",
    "status-codes",
    "iana",
    "cloudflare",
    "nginx",
    "rest-api",
    "type-safe",
    "tree-shaking",
    "nextjs",
    "express"
  ],
  "author": "master4n",
  "license": "MIT",
  "devDependencies": {
    "rimraf": "^5.0.5",
    "tsup": "^8.0.2",
    "tsx": "^4.7.1",
    "typescript": "^5.3.3",
    "vitest": "^1.3.1"
  }
}
```

### 3.2. Compiler Rules (`tsconfig.json`)
Configure strict settings to ensure explicit type checks across every module boundary.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "declaration": true,
    "declarationMap": false,
    "emitDeclarationOnly": false,
    "outDir": "./dist",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true
  },
  "include": ["src/**/*", "scripts/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3.3. Dual Bundler Automation (`tsup.config.ts`)
Configure `tsup` to split bundles, minify production assets, generate isolated `.d.ts` declaration maps, and preserve pristine tree-shaking entrypoints.

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    iana: 'src/iana/index.ts',
    cloudflare: 'src/cloudflare/index.ts',
    nginx: 'src/nginx/index.ts',
    utils: 'src/utils/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,
  minify: true,
  sourcemap: false,
  treeshake: true,
  external: [],
});
```

---

## 4. Core Type Architecture (`src/core/types.ts`)

These strong type structures provide semantic criteria that LLM code generators look for when diagnosing logic paths.

```typescript
/**
 * Strict categorizations mapping directly to HTTP functional tiers.
 */
export type HttpStatusCategory =
  | 'Informational'
  | 'Success'
  | 'Redirection'
  | 'Client Error'
  | 'Server Error'
  | 'Vendor Extension';

/**
 * Standard structural record containing full semantic parameters for a specific code.
 */
export interface HttpStatusMetadata {
  readonly code: number;
  readonly phrase: string;
  readonly description: string;
  readonly category: HttpStatusCategory;
  readonly rfc: string | null;
  readonly specUrl: string | null;
  readonly isRetryable: boolean;
  readonly expectsEmptyBody: boolean;
}

/**
 * Maps status integer codes directly to high-fidelity metadata.
 */
export type HttpStatusRegistryMap = Record<number, HttpStatusMetadata>;
```

---

## 5. High-Fidelity Data Dictionary Implementations

### 5.1. Standard IANA Registry (`src/iana/index.ts`)
This module aggregates standard status identifiers alongside deep metadata definitions and official RFC web references.

```typescript
import { HttpStatusMetadata } from '../core/types';

export const IanaStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type IanaStatusCode = typeof IanaStatus[keyof typeof IanaStatus];
export type IanaStatusName = keyof typeof IanaStatus;

export const IanaRegistry: Record<IanaStatusCode, HttpStatusMetadata> = {
  200: {
    code: 200,
    phrase: 'OK',
    description: 'The request has succeeded. The information returned with the response is dependent on the method used in the request.',
    category: 'Success',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.1',
    isRetryable: false,
    expectsEmptyBody: false,
  },
  201: {
    code: 201,
    phrase: 'Created',
    description: 'The request has been fulfilled and has resulted in one or more new resources being created.',
    category: 'Success',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.2',
    isRetryable: false,
    expectsEmptyBody: false,
  },
  204: {
    code: 204,
    phrase: 'No Content',
    description: 'The server has successfully fulfilled the request and there is no additional content to send in the response payload body.',
    category: 'Success',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.3.5',
    isRetryable: false,
    expectsEmptyBody: true,
  },
  304: {
    code: 304,
    phrase: 'Not Modified',
    description: 'The recipient would have received a 200 (OK) response if the alternatives had not been conditioned. Tells the client to use cached data.',
    category: 'Redirection',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.5',
    isRetryable: false,
    expectsEmptyBody: true,
  },
  400: {
    code: 400,
    phrase: 'Bad Request',
    description: 'The server cannot or will not process the request due to something that is perceived to be a client error.',
    category: 'Client Error',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.1',
    isRetryable: false,
    expectsEmptyBody: false,
  },
  401: {
    code: 401,
    phrase: 'Unauthorized',
    description: 'The request has not been applied because it lacks valid authentication credentials for the target resource.',
    category: 'Client Error',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.2',
    isRetryable: false,
    expectsEmptyBody: false,
  },
  403: {
    code: 403,
    phrase: 'Forbidden',
    description: 'The server understood the request but refuses to authorize it.',
    category: 'Client Error',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.4',
    isRetryable: false,
    expectsEmptyBody: false,
  },
  404: {
    code: 404,
    phrase: 'Not Found',
    description: 'The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.',
    category: 'Client Error',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.5',
    isRetryable: false,
    expectsEmptyBody: false,
  },
  429: {
    code: 429,
    phrase: 'Too Many Requests',
    description: 'The user has sent too many requests in a given amount of time ("rate limiting").',
    category: 'Client Error',
    rfc: 'RFC6585',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc6585#section-4',
    isRetryable: true,
    expectsEmptyBody: false,
  },
  500: {
    code: 500,
    phrase: 'Internal Server Error',
    description: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
    category: 'Server Error',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.1',
    isRetryable: true,
    expectsEmptyBody: false,
  },
  502: {
    code: 502,
    phrase: 'Bad Gateway',
    description: 'The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.',
    category: 'Server Error',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.3',
    isRetryable: true,
    expectsEmptyBody: false,
  },
  503: {
    code: 503,
    phrase: 'Service Unavailable',
    description: 'The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.',
    category: 'Server Error',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.4',
    isRetryable: true,
    expectsEmptyBody: false,
  },
  504: {
    code: 504,
    phrase: 'Gateway Timeout',
    description: 'The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request.',
    category: 'Server Error',
    rfc: 'RFC9110',
    specUrl: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.5',
    isRetryable: true,
    expectsEmptyBody: false,
  },
} as const;
```

### 5.2. Cloudflare Extension Registry (`src/cloudflare/index.ts`)
Maps specific operational response profiles returned exclusively by Cloudflare's globally distributed edge worker tiers.

```typescript
import { HttpStatusMetadata } from '../core/types';

export const CloudflareStatus = {
  UNKNOWN_ERROR: 520,
  WEB_SERVER_IS_DOWN: 521,
  CONNECTION_TIMED_OUT: 522,
  ORIGIN_UNREACHABLE: 523,
  TIMEOUT_OCCURRED: 524,
  SSL_HANDSHAKE_FAILED: 525,
  INVALID_SSL_CERTIFICATE: 526,
  RAILGUN_ERROR: 527,
} as const;

export type CloudflareStatusCode = typeof CloudflareStatus[keyof typeof CloudflareStatus];

export const CloudflareRegistry: Record<CloudflareStatusCode, HttpStatusMetadata> = {
  520: {
    code: 520,
    phrase: 'Web Server Returned an Unknown Error',
    description: 'The origin server returned an empty, unknown, or unexpected response to Cloudflare.',
    category: 'Vendor Extension',
    rfc: null,
    specUrl: 'https://support.cloudflare.com/hc/en-us/articles/115003011431-Troubleshooting-Cloudflare-5XX-errors#code_520',
    isRetryable: true,
    expectsEmptyBody: false,
  },
  521: {
    code: 521,
    phrase: 'Web Server Is Down',
    description: 'The origin server refused the connection from Cloudflare.',
    category: 'Vendor Extension',
    rfc: null,
    specUrl: 'https://support.cloudflare.com/hc/en-us/articles/115003011431-Troubleshooting-Cloudflare-5XX-errors#code_521',
    isRetryable: true,
    expectsEmptyBody: false,
  },
  522: {
    code: 522,
    phrase: 'Connection Timed Out',
    description: 'Cloudflare could not negotiate a TCP handshake with the origin server before timing out.',
    category: 'Vendor Extension',
    rfc: null,
    specUrl: 'https://support.cloudflare.com/hc/en-us/articles/115003011431-Troubleshooting-Cloudflare-5XX-errors#code_522',
    isRetryable: true,
    expectsEmptyBody: false,
  },
  524: {
    code: 524,
    phrase: 'A Timeout Occurred',
    description: 'Cloudflare successfully connected and sent data to the origin, but the server took too long to respond with a payload.',
    category: 'Vendor Extension',
    rfc: null,
    specUrl: 'https://support.cloudflare.com/hc/en-us/articles/115003011431-Troubleshooting-Cloudflare-5XX-errors#code_524',
    isRetryable: true,
    expectsEmptyBody: false,
  },
} as const;
```

### 5.3. Nginx Extension Registry (`src/nginx/index.ts`)
Exposes custom tracking parameters specific to structural log filters inside classical Nginx runtime environments.

```typescript
import { HttpStatusMetadata } from '../core/types';

export const NginxStatus = {
  NO_RESPONSE: 444,
  CLIENT_CLOSED_REQUEST: 499,
} as const;

export type NginxStatusCode = typeof NginxStatus[keyof typeof NginxStatus];

export const NginxRegistry: Record<NginxStatusCode, HttpStatusMetadata> = {
  444: {
    code: 444,
    phrase: 'No Response',
    description: 'Nginx custom internal status code used to instruct the server to immediately close the connection without sending any headers to the client.',
    category: 'Vendor Extension',
    rfc: null,
    specUrl: 'https://nginx.org/en/docs/http/ngx_http_rewrite_module.html',
    isRetryable: false,
    expectsEmptyBody: true,
  },
  499: {
    code: 499,
    phrase: 'Client Closed Request',
    description: 'Nginx internal status code introduced to identify scenarios where the client disconnected while the server was actively processing the request downstream.',
    category: 'Vendor Extension',
    rfc: null,
    specUrl: 'https://www.nginx.com/resources/wiki/extending/api/http/',
    isRetryable: false,
    expectsEmptyBody: true,
  },
} as const;
```

---

## 6. Semantic Functional Utilities (`src/utils/index.ts`)

These predictive helpers wrap common evaluation rules into clean, highly optimized functional signatures.

```typescript
import { IanaRegistry } from '../iana';
import { CloudflareRegistry } from '../cloudflare';
import { NginxRegistry } from '../nginx';

/**
 * Combines all independent sub-registries into an on-demand fallback scanner.
 */
const lookupMetadata = (code: number) => {
  return (
    IanaRegistry[code as keyof typeof IanaRegistry] ||
    CloudflareRegistry[code as keyof typeof CloudflareRegistry] ||
    NginxRegistry[code as keyof typeof NginxRegistry] ||
    null
  );
};

export const isInformational = (code: number): boolean => code >= 100 && code < 200;
export const isSuccess       = (code: number): boolean => code >= 200 && code < 300;
export const isRedirection   = (code: number): boolean => code >= 300 && code < 400;
export const isClientError   = (code: number): boolean => code >= 400 && code < 500;
export const isServerError   = (code: number): boolean => code >= 500 && code < 600;
export const isError         = (code: number): boolean => code >= 400;

/**
 * Checks if a status code indicates an ephemeral error condition that is safe to retry.
 */
export const isRetryable = (code: number): boolean => {
  const meta = lookupMetadata(code);
  if (meta) return meta.isRetryable;

  // Generic fallback inference rules
  if (code === 429 || code === 408) return true;
  if (isServerError(code)) {
    return code !== 501 && code !== 505; // Do not retry Not Implemented or Unsupported Version
  }
  return false;
};

/**
 * Evaluates whether an HTTP status code explicitly forbids returning a body payload.
 */
export const hasEmptyBody = (code: number): boolean => {
  const meta = lookupMetadata(code);
  if (meta) return meta.expectsEmptyBody;

  // Spec baseline fallbacks
  return code === 204 || code === 304 || (code >= 100 && code < 200);
};
```

---

## 7. Global Aggregations (`src/core/base-registry.ts` & `src/index.ts`)

### 7.1. Aggregator Core Layer (`src/core/base-registry.ts`)
Merges individual data buckets into a single runtime structure.

```typescript
import { HttpStatusRegistryMap } from './types';
import { IanaRegistry } from '../iana';
import { CloudflareRegistry } from '../cloudflare';
import { NginxRegistry } from '../nginx';

export const CompleteRegistry: HttpStatusRegistryMap = {
  ...IanaRegistry,
  ...CloudflareRegistry,
  ...NginxRegistry,
};
```

### 7.2. Global Application Facade Base Entrance (`src/index.ts`)
The library root maps out individual entry paths for absolute backward-compatibility and clean horizontal exposure.

```typescript
export * from './core/types';
export * from './core/base-registry';
export * from './iana';
export * from './cloudflare';
export * from './nginx';
export * from './utils';
```

---

## 8. Build-Hook Asset Manifest Generation Script (`scripts/build-manifest.ts`)

This automated compile hook processes internal datasets into a clean, unminified `http-status-registry.json` file at the project root. This ensures the full registry remains cleanly crawlable by external LLM RAG processors and structural parsers.

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { CompleteRegistry } from '../src/core/base-registry';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateStaticManifest() {
  try {
    const targetPath = path.resolve(__dirname, '../http-status-registry.json');
    
    // Sort keys logically ascending to improve semantic indexing
    const sortedRegistry: Record<string, any> = {};
    Object.keys(CompleteRegistry)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((code) => {
        sortedRegistry[code.toString()] = CompleteRegistry[code];
      });

    fs.writeFileSync(
      targetPath,
      JSON.stringify(sortedRegistry, null, 2),
      'utf-8'
    );
    console.log(`Successfully compiled high-fidelity JSON manifest to: ${targetPath}`);
  } catch (error) {
    console.error('Critically failed to output compilation manifest database:', error);
    process.exit(1);
  }
}

generateStaticManifest();
```

---

## 9. Quality Control & Testing Protocol

The implementation agent must verify execution matrices by running unit tests inside `vitest`.

```typescript
// src/__tests__/status.test.ts
import { describe, test, expect } from 'vitest';
import { IanaStatus, IanaRegistry } from '../iana';
import { isRetryable, hasEmptyBody } from '../utils';

describe('HTTP Status Code v2.0.0 Architecture Suite', () => {
  test('Strict Object mappings verify immutable as const patterns', () => {
    // @ts-expect-error - Ensures mutations fail compile checks
    expect(() => { IanaStatus.OK = 201; }).toThrow();
  });

  test('High fidelity metadata maps accurate structural specifications', () => {
    const tooManyRequests = IanaRegistry[429];
    expect(tooManyRequests.phrase).toBe('Too Many Requests');
    expect(tooManyRequests.isRetryable).toBe(true);
    expect(tooManyRequests.rfc).toBe('RFC6585');
  });

  test('Semantic utility predicates evaluate runtime scenarios accurately', () => {
    expect(isRetryable(429)).toBe(true);
    expect(isRetryable(400)).toBe(false);
    expect(hasEmptyBody(204)).toBe(true);
    expect(hasEmptyBody(200)).toBe(false);
  });
});
```

---

## 10. AI & Developer Optimization Documentation (`README.md`)

```markdown
# @master4n/http-status

The definitive, enterprise-grade, single source of truth for standard and vendor-specific HTTP status codes. Designed from the ground up for high-performance human development and perfect context integration with AI coding agents.

## Feature Matrix
- **Zero Runtime Dependencies:** Extemely lightweight runtime footprint.
- **Modern Multi-Entrypoint Architecture:** Isolate specific configurations cleanly (`@master4n/http-status/iana`, `@master4n/http-status/cloudflare`).
- **Complete Tree-Shaking Support:** Built via dual ESM/CJS targets using `tsup`.
- **High-Fidelity Metadata Registry:** Maps descriptions, official RFC specifications, and platform-level behaviors.
- **Predictive Helpers:** Expressive operational utilities like `isRetryable(code)` or `hasEmptyBody(code)`.

---

## Installation
```bash
npm install @master4n/http-status
```

---

## Usage Examples

### 1. Isolated Entrypoint Import (Tree-shakable Optimization)
```typescript
import { IanaStatus } from '@master4n/http-status/iana';

if (response.status === IanaStatus.TOO_MANY_REQUESTS) {
  // Execute targeted flow logic
}
```

### 2. High-Fidelity Infrastructure Scanners
```typescript
import { CompleteRegistry } from '@master4n/http-status';

const metadata = CompleteRegistry[429];
console.log(metadata.phrase);       // "Too Many Requests"
console.log(metadata.rfc);          // "RFC6585"
console.log(metadata.specUrl);      // "https://datatracker.ietf.org/doc/html/rfc6585#section-4"
```

### 3. Implementing Resilient Automated Retry Logic
```typescript
import { isRetryable } from '@master4n/http-status/utils';

async function executeFetchWithRetry(url: string, retries = 3) {
  const response = await fetch(url);
  
  if (!response.ok) {
    if (isRetryable(response.status) && retries > 0) {
      const delay = response.headers.get('Retry-After') 
        ? parseInt(response.headers.get('Retry-After')!) * 1000 
        : 2000;
        
      await new Promise(res => setTimeout(res, delay));
      return executeFetchWithRetry(url, retries - 1);
    }
    throw new Error(`Terminal request failure with code: ${response.status}`);
  }
  return response.json();
}
```

---

## Developer Operations (DevOps) Commands
- **Execute Production Compilation:** `npm run build`
- **Trigger Test Validations:** `npm run test`
- **Verify Type Safety Integration:** `npm run typecheck`
```

---

## 11. Definition of Done (DoD)

The execution cycle is considered fully complete only when all the following verification checkpoints return a successful evaluation:

1. **Compilation Validation:** `npm run build` exits cleanly with a `0` code, indicating no TypeScript type errors or syntax issues.
2. **Dual Dist Targets Present:** The `dist/` root directory successfully generates and separates isolated `.js`, `.cjs`, and `.d.ts` file structures for every single entry module.
3. **Exhaustive Testing Verification:** Running `npm run test` completes with a 100% success rate across all internal assertions.
4. **Machine-Readable Metadata Output:** The compilation post-hook successfully writes a comprehensive, unminified `http-status-registry.json` database containing every status code configuration to the project root.
5. **Clean Code Isolation:** Using the `utils` sub-path does not load or leak the full text dictionaries of the vendor modules into the final client-side bundle.
