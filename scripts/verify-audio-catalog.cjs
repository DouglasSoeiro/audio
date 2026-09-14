const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(path.join(root, 'dist/story-catalog.js'), 'utf8'),
  context
);

const catalog = context.window.STORY_CATALOG;
const manifestPath = path.join(root, 'cartesia_audio/progress.json');
const manifest = fs.existsSync(manifestPath) ? require(manifestPath) : null;

assert.strictEqual(catalog.length, 40, 'O catálogo deve conter 40 histórias');
assert.strictEqual(new Set(catalog.map((story) => story.audio)).size, 40, 'Cada história deve ter um áudio exclusivo');

if (manifest) {
  assert.strictEqual(manifest.stories.length, 40, 'O manifesto deve conter 40 histórias');
}

for (let index = 0; index < catalog.length; index += 1) {
  const story = catalog[index];
  const number = String(index + 1).padStart(2, '0');
  const deployedMp3 = path.join(root, 'dist', story.audio.replace(/^\//, ''));
  assert(fs.existsSync(deployedMp3), `MP3 final ausente: ${deployedMp3}`);
  assert(fs.statSync(deployedMp3).size > 0, `MP3 final vazio: ${deployedMp3}`);

  if (manifest) {
    const source = manifest.stories[index];
    const basename = path.basename(source.audio_file, '.wav');
    const expectedAudio = `/assets/audio/${source.module}/${basename}.mp3`;
    const wav = path.join(root, 'cartesia_audio', source.module, `${basename}.wav`);
    const originalMp3 = path.join(root, 'cartesia_audio', source.module, `${basename}.mp3`);

    assert.strictEqual(source.number, index + 1, `Numeração inválida na história ${number}`);
    assert.strictEqual(source.status, 'completed', `Fonte incompleta na história ${number}`);
    assert.strictEqual(story.title, source.title, `Título divergente na história ${number}`);
    assert.strictEqual(story.audio, expectedAudio, `Áudio incorreto para ${story.title}`);
    assert(fs.existsSync(wav), `WAV ausente: ${wav}`);
    assert(fs.existsSync(originalMp3), `MP3 original ausente: ${originalMp3}`);
  }
}

console.log('PASS: 40 histórias ligadas, em ordem, aos 40 áudios completos e exclusivos.');
