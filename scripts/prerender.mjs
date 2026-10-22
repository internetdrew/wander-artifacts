import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

// Bundle the same App used by the browser so markup, IDs and asset URLs agree.
// The temporary bundle lives under the project to resolve external dependencies.
const output = await mkdtemp(resolve('node_modules/.wander-prerender-'));
try {
  await build({
    build: {
      ssr: 'src/entry-server.tsx',
      outDir: output,
      emptyOutDir: true,
      copyPublicDir: false,
      rolldownOptions: { output: { entryFileNames: 'entry-server.mjs' } },
    },
  });
  const { render } = await import(pathToFileURL(join(output, 'entry-server.mjs')).href);
  const template = await readFile('dist/index.html', 'utf8');
  const marker = '<div id="root"></div>';
  if (!template.includes(marker)) throw new Error('Prerender root marker missing');
  await writeFile('dist/index.html', template.replace(marker, () => `<div id="root">${render()}</div>`));
  console.log('Prerendered initial page into dist/index.html');
} finally {
  await rm(output, { recursive: true, force: true });
}
