const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'browser',
  target: 'es2020',
  format: 'esm',
  outfile: 'dist/index.js',
  external: ['hono', 'hono/cors', 'jose', 'bcrypt', 'jsonwebtoken'],
  loader: {
    '.ts': 'ts'
  }
}).catch(() => process.exit(1));
