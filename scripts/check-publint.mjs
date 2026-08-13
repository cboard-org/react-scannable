import { readFile } from 'node:fs/promises';
import { publint } from 'publint';
import { formatMessage } from 'publint/utils';

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const publishedPaths = [
  'package.json',
  'README.md',
  'LICENSE',
  packageJson.main,
  packageJson.module,
];
const files = await Promise.all(
  publishedPaths.map(async (path) => ({
    name: `package/${path}`,
    data: await readFile(path),
  })),
);

const { messages, pkg } = await publint({
  level: 'warning',
  pack: { files },
  pkgDir: 'package',
  strict: true,
});

if (messages.length > 0) {
  messages.forEach((message) => console.error(formatMessage(message, pkg)));
  process.exitCode = 1;
} else {
  console.log('Published package passes publint with no warnings.');
}
