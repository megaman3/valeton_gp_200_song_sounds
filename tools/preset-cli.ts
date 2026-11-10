/**
 * Hämta ett preset från terminalen – utan AI.
 *   npm run preset -- "enter sandman"
 *   npm run preset -- "paranoid" solo
 */
import { allSongs, formatPreset, generator, searchSongs } from '../src/engine';

const [query = '', partFilter] = process.argv.slice(2);
const hits = searchSongs(allSongs, query, 10);

if (!query || hits.length === 0) {
  console.log(query ? `Ingen låt matchar "${query}".` : 'Ange en låt, t.ex. npm run preset -- "paranoid"');
  console.log(`Databasen innehåller ${allSongs.length} låtar.`);
  process.exit(1);
}
if (hits.length > 1) {
  console.log('Träffar:');
  hits.forEach((s, i) => console.log(`  ${i === 0 ? '→' : ' '} ${s.artist} – ${s.title}`));
  console.log('');
}

const song = hits[0];
const parts = partFilter
  ? song.parts.filter((p) => p.id.startsWith(partFilter) || p.name.toLowerCase().includes(partFilter.toLowerCase()))
  : song.parts;
for (const part of parts) {
  console.log(formatPreset(generator.generate(song, part)));
  console.log('\n' + '-'.repeat(60) + '\n');
}
