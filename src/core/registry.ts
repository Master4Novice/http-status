import type { HttpStatusMetadata, HttpStatusRegistryMap } from './types.js';
import { IanaRegistry } from '../iana/index.js';
import { CloudflareRegistry } from '../cloudflare/index.js';
import { NginxRegistry } from '../nginx/index.js';

export const CompleteRegistry: HttpStatusRegistryMap = Object.freeze({
  ...IanaRegistry,
  ...CloudflareRegistry,
  ...NginxRegistry,
}) as HttpStatusRegistryMap;

/**
 * Returns full per-code metadata, or `undefined` if the code is not in any
 * known registry. Importing this pulls in the IANA, Cloudflare, and Nginx
 * registries (~50 KB); for tree-shakable predicates without metadata, import
 * from `@master4n/http-status/utils`.
 */
export const getMetadata = (code: number): HttpStatusMetadata | undefined =>
  CompleteRegistry[code];
