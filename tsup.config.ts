import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'iana/index': 'src/iana/index.ts',
    'cloudflare/index': 'src/cloudflare/index.ts',
    'nginx/index': 'src/nginx/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
  dts: true,
  splitting: false,
  clean: true,
  minify: true,
  sourcemap: false,
  treeshake: true,
  target: 'es2022',
  platform: 'neutral',
  external: [],
});
