#!/usr/bin/env node
// Builds the files a plain-HTML app copies in (no Node, no framework, no network):
//   dist/pbgc.js   classic script, defines window.PBGC (dialog, menu, tooltip, toggletip, file picker, carousel, toast)
//   dist/pbgc.css  tokens + components, in one file
// Usage: node scripts/build-vanilla.mjs   (run `npm run tokens` first if tokens.json changed)

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildVanilla } from './lib/vanilla.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/pbgc.js'), buildVanilla(read('src/behaviors/index.js')));
writeFileSync(join(root, 'dist/pbgc.css'), `${read('tokens/tokens.css')}\n${read('src/styles/components.css')}`);
console.log('dist/pbgc.js and dist/pbgc.css written');
