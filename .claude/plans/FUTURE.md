# @master4n/http-status — Future Plan

Roadmap for versions after `2.0.0`. Items are ranked within each section by ROI (effort vs. customer impact). Anything marked **AI-customer** is justified primarily by the "machine-readable single source of truth for AI agents" positioning; **dev-customer** items help human consumers.

---

## 2.0.x — small follow-ups (next release)

These are zero-risk patches that should ship within a few weeks. None require a major bump.

### 1. Pin GitHub Actions to commit SHAs — *supply-chain hygiene*
- File: `.github/workflows/ci.yml`
- Today: `uses: actions/checkout@v4`, `uses: actions/setup-node@v4`
- Change to the resolved commit SHA, with the version as a trailing comment.
- Effort: 15 min. Use `gh api repos/actions/checkout/git/refs/tags/v4` to look up the SHA.

### 2. Publish with `--provenance` — *npm supply-chain badge*
- Requires the publish to run from CI via GitHub OIDC (not from a local `npm publish`).
- Adds the "Provenance" badge on the npm package page; consumers can verify the tarball was built by your repo, by your CI, at a known commit.
- Effort: ~1 hour. Add a `release.yml` workflow that triggers on a tag push, runs `npm publish ./dist --provenance --access public`, with `id-token: write` permissions and an `NPM_TOKEN` (granular automation token) secret.
- Reference: https://docs.npmjs.com/generating-provenance-statements

### 3. Ship a minified JSON variant — *AI-customer*
- Add `http-status-registry.min.json` alongside the pretty-printed file (`JSON.stringify(sorted)` with no indent).
- Roughly halves the over-the-wire size for clients that fetch directly without gzip.
- Add `"./registry.min.json"` to the `exports` map.
- Effort: 10 min in `scripts/build-manifest.ts`.

### 4. JSON Schema document — *AI-customer + dev-customer*
- Generate `schema.json` describing the `HttpStatusMetadata` shape — discriminated unions for `safeForMethods`, enum constraints for `category`/`source`/`retryStrategy`, etc.
- Lets consumers validate registry slices and helps agents reason over the contract before they ingest data.
- Use a `ts-json-schema-generator` step in the build, or hand-author.
- Effort: ~2 hours.

---

## 2.1 — vendor coverage expansion

Goal: become the canonical reference for non-IANA status codes too, without compromising the "every field has a citation" promise.

### 5. AWS ELB codes
- 460, 463, 464, 561.
- Source: AWS docs at https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-troubleshooting.html
- New module: `src/aws/index.ts`, mirroring the Cloudflare/Nginx shape.
- New entry point: `@master4n/http-status/aws`.

### 6. Microsoft IIS codes
- 440 (Login Timeout), 449 (Retry With), legacy 451-IIS variants.
- Source: Microsoft Learn IIS error reference.
- New module: `src/iis/index.ts`, entry point `@master4n/http-status/iis`.

### 7. Apache / unofficial registry
- 218, 419, 420, 450, 498, 509, 529, 530, 598, 599 — folklore-tier codes seen in the wild but not formally standardised.
- Mark each entry with `deprecated: true` or a new `unofficial: true` flag in metadata so consumers can filter them out.
- New module: `src/unofficial/index.ts`, entry point `@master4n/http-status/unofficial`.

### 8. Per-code `examples: { request, response }[]` — *AI-customer*
- Deferred from `2.0.0`. Each entry gains 1–3 short request/response examples in raw HTTP wire format.
- Significantly improves RAG context quality when an agent is asked "show me what a 429 looks like."
- Additive: schema stays backward-compatible.
- High maintenance — start with the 20 most-trafficked codes, leave others empty.

### 9. Richer `guidance.commonCauses` — *AI-customer*
- Today many entries have a single bullet. Aim for 2–3 distinct, non-overlapping bullets per code.
- Audit each entry against StackOverflow's top questions for that code; the most-asked causes should appear.

### 10. MCP server companion package — *AI-customer*
- New package `@master4n/http-status-mcp` (separate npm package, same monorepo or separate repo).
- Exposes the registry over Model Context Protocol so agents can query without `npm install`.
- Tools: `get_status(code)`, `find_status_by_phrase(query)`, `list_retryable_codes()`, `list_codes_by_source(source)`.
- Reference: https://modelcontextprotocol.io/

---

## 2.2 — discoverability

### 11. GitHub Pages mirror — *AI-customer + SEO*
- Browsable HTML index at `https://master4novice.github.io/http-status/` with one page per code (e.g., `/429`, `/520`).
- Search engines and AI crawlers index it.
- Generate from the JSON registry at build time, deploy via the existing CI workflow.
- Effort: ~4 hours including a minimal Tailwind/Pico stylesheet.

### 12. Locale-aware phrase translations
- New sub-path family: `@master4n/http-status/phrases/<locale>` (e.g., `/phrases/de`, `/phrases/ja`, `/phrases/hi`).
- Each module exports `{ [code: number]: string }` of the localised reason phrase.
- Start with `en` (already covered by the `phrase` field) + `de`, `ja`, `fr`, `es`, `zh-Hans`, `hi`.

### 13. CLI tool
- `npx @master4n/http-status 429` prints metadata for a code.
- `npx @master4n/http-status --retryable` lists every retryable code.
- Lives in the same package via a `"bin"` field.
- Effort: ~2 hours.

---

## 3.0 — bigger bets

These are speculative; revisit once 2.x has shipped and we have real usage data.

### 14. HTTP/3 + gRPC status mapping
- Cross-protocol semantics: gRPC `INTERNAL` ↔ HTTP `500`, gRPC `RESOURCE_EXHAUSTED` ↔ HTTP `429`, etc.
- New module `src/grpc/index.ts` with bidirectional lookup helpers.
- Useful for service-mesh and API-gateway users translating between protocols.

### 15. Auto-build from IANA registry pull
- Scheduled GitHub Action that diffs against the IANA HTTP Status Code XML at https://www.iana.org/assignments/http-status-codes/http-status-codes.xml.
- Opens a PR when a new code is registered.
- Eliminates the manual maintenance window between IANA updates and our releases.

### 16. Confidence scores on guidance fields — *AI-customer*
- Today `guidance` is binary: we said it or we didn't.
- Add `guidance.confidence: 'high' | 'medium' | 'low'` so AI agents can weight the recommendation appropriately.
- `high` = backed by multiple authoritative sources; `medium` = single source but reputable; `low` = inferred or community wisdom.
- Requires a one-time audit of every existing guidance block.

### 17. Plugin API for custom vendor registries
- Allow downstream consumers to register their own vendor codes with the same `HttpStatusMetadata` shape.
- Use case: internal API gateway products with their own custom 5xx range.
- Export a `registerVendor(name, registry)` function from the root that merges into `CompleteRegistry` at runtime.

---

## Permanent backlog (no version assigned)

- Benchmark suite to enforce that `dist/utils/index.js` stays under 1 KB. Today it's 591 bytes; regression here would silently defeat the tree-shake guarantee.
- Visual diff CI step that posts the JSON registry delta as a PR comment on every change.
- A `WebStandardsStatus` registry covering CORS preflight semantics, fetch-spec error categorisations, etc. (currently out of scope).

---

## Out of scope — explicitly not doing

These have been considered and rejected. Re-litigating them needs a strong new argument.

- **Re-introducing the v1 `HttpStatus` class.** The clean break was a deliberate v2.0.0 decision (see CHANGELOG). Users on v1 can pin via the `legacy` dist-tag indefinitely.
- **Runtime dependencies.** Zero-deps is a positioning commitment, not laziness. Anything that needs a dep gets carved into a separate companion package.
- **Per-code i18n of `description` / `guidance`.** Phrase-only translation in 2.2 is enough; full localisation of long-form text would balloon the registry without commensurate value.
- **A general-purpose "HTTP toolkit" (parsers, builders, header helpers).** Scope creep. Different package.
