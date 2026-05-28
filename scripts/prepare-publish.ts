import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

if (!fs.existsSync(distDir)) {
  console.error(`[prepare-publish] dist/ does not exist. Run "tsup" first.`);
  process.exit(1);
}

const devManifestPath = path.join(projectRoot, 'package.json');
const devManifest = JSON.parse(fs.readFileSync(devManifestPath, 'utf-8')) as Record<
  string,
  unknown
>;

const publishedManifest: Record<string, unknown> = {
  name: devManifest.name,
  version: devManifest.version,
  description: devManifest.description,
  type: 'module',
  sideEffects: false,
  main: './index.cjs',
  module: './index.js',
  types: './index.d.ts',
  exports: {
    '.': {
      types: './index.d.ts',
      import: './index.js',
      require: './index.cjs',
    },
    './iana': {
      types: './iana/index.d.ts',
      import: './iana/index.js',
      require: './iana/index.cjs',
    },
    './cloudflare': {
      types: './cloudflare/index.d.ts',
      import: './cloudflare/index.js',
      require: './cloudflare/index.cjs',
    },
    './nginx': {
      types: './nginx/index.d.ts',
      import: './nginx/index.js',
      require: './nginx/index.cjs',
    },
    './utils': {
      types: './utils/index.d.ts',
      import: './utils/index.js',
      require: './utils/index.cjs',
    },
    './registry.json': './http-status-registry.json',
    './llms.txt': './llms.txt',
  },
  keywords: devManifest.keywords,
  author: devManifest.author,
  license: devManifest.license,
  repository: devManifest.repository,
  bugs: devManifest.bugs,
  homepage: devManifest.homepage,
  contributors: devManifest.contributors,
};

const distManifestPath = path.join(distDir, 'package.json');
fs.writeFileSync(
  distManifestPath,
  JSON.stringify(publishedManifest, null, 2) + '\n',
  'utf-8',
);

const filesToCopy = ['README.md', 'LICENSE', 'CHANGELOG.md', 'llms.txt'];
for (const filename of filesToCopy) {
  const src = path.join(projectRoot, filename);
  const dest = path.join(distDir, filename);
  if (!fs.existsSync(src)) {
    console.error(`[prepare-publish] missing source file: ${filename}`);
    process.exit(1);
  }
  fs.copyFileSync(src, dest);
}

const expectedDistFiles = [
  'package.json',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'llms.txt',
  'http-status-registry.json',
  'index.js',
  'index.cjs',
  'index.d.ts',
  'iana/index.js',
  'iana/index.cjs',
  'iana/index.d.ts',
  'cloudflare/index.js',
  'cloudflare/index.cjs',
  'cloudflare/index.d.ts',
  'nginx/index.js',
  'nginx/index.cjs',
  'nginx/index.d.ts',
  'utils/index.js',
  'utils/index.cjs',
  'utils/index.d.ts',
];

const missing: string[] = [];
for (const relative of expectedDistFiles) {
  const target = path.join(distDir, relative);
  if (!fs.existsSync(target)) missing.push(relative);
}

if (missing.length > 0) {
  console.error(
    `[prepare-publish] missing artifacts in dist/:\n  - ${missing.join('\n  - ')}`,
  );
  process.exit(1);
}

console.log(
  `[prepare-publish] dist/ ready for publish (${expectedDistFiles.length} files verified).`,
);
