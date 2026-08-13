import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const cjsUrl = new URL(`../${packageJson.main}`, import.meta.url);
const esmUrl = new URL(`../${packageJson.module}`, import.meta.url);
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
const requestAnimationFrame = () => 0;
const cancelAnimationFrame = () => {};

dom.window.requestAnimationFrame = requestAnimationFrame;
dom.window.cancelAnimationFrame = cancelAnimationFrame;

Object.assign(globalThis, {
  document: dom.window.document,
  Element: dom.window.Element,
  MouseEvent: dom.window.MouseEvent,
  requestAnimationFrame,
  cancelAnimationFrame,
  window: dom.window,
});

const cjsExports = require(cjsUrl.pathname);
const esmSource = await readFile(esmUrl, 'utf8');

assert.deepEqual(Object.keys(cjsExports).sort(), ['Scannable', 'Scanner']);
assert.match(esmSource, /export\s*\{[^}]*Scannable[^}]*Scanner[^}]*\}/s);
assert.doesNotMatch(esmSource, /from ['"](?:node:)?crypto['"]|require\(['"](?:node:)?crypto['"]\)/);
assert.doesNotMatch(esmSource, /(?:^|[=(:,;]\s*)\([^)]*\)\s*=>/m);
assert.match(document.head.textContent, /\.scanner__focused/);

console.log('Published CJS and ESM entry points preserve the package contract.');
dom.window.close();
process.exit(0);
