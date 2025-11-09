import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const highEntropyRegex = /[A-Za-z0-9+/]{32,}/g;

function walk(dir: string, results: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.git')) continue;
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath, results);
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const hits: Array<{ file: string; snippet: string }> = [];

for (const file of walk(process.cwd())) {
  const content = readFileSync(file, 'utf8');
  const matches = content.match(highEntropyRegex);
  if (matches) {
    hits.push({ file, snippet: matches.slice(0, 3).join(', ') });
  }
}

if (hits.length === 0) {
  console.log('No high-entropy strings detected.');
} else {
  console.warn('Potential secrets found:');
  hits.forEach((hit) => console.warn(`- ${hit.file}: ${hit.snippet}`));
}
