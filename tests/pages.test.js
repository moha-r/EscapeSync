const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = fs.readdirSync(root).filter((name) => /^EscapeSync Phase \d+\.dc\.html$/.test(name));
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

test('all nine phases load app.js', () => {
  assert.equal(pages.length, 9);
  for (const page of pages) assert.match(read(page), /<script src="\.\/app\.js"><\/script>/, page);
});

test('the image-slot state sidecar exists for clean browser loads', () => {
  assert.equal(fs.existsSync(path.join(root, '.image-slots.state.json')), true);
});

test('all local EscapeSync links resolve', () => {
  for (const page of pages) {
    for (const [, href] of read(page).matchAll(/href="(EscapeSync [^"]+\.html)(?:#[^"]*)?"/g)) {
      assert.ok(fs.existsSync(path.join(root, href)), `${page}: missing ${href}`);
    }
  }
});

test('dynamic browser URL attributes do not contain raw templates', () => {
  for (const page of pages) {
    assert.doesNotMatch(
      read(page),
      /(?:src|d)="\{\{\s*(?:it\.photo|sel\.photo|nextPhoto|mapRoute)\s*\}\}"/,
      page
    );
  }
});

test('landing and builder expose the connected primary flow', () => {
  assert.match(read('EscapeSync Home.html'), /EscapeSync Phase 1\.dc\.html/);
  assert.match(read('EscapeSync Phase 1.dc.html'), /data-action="start-trip"/);
  assert.match(read('EscapeSync Phase 2.dc.html'), /EscapeSyncApp\.saveState/);
  assert.match(read('EscapeSync Phase 2.dc.html'), /EscapeSyncApp\.navigate\(["']command["']\)/);
});

test('command center routes every feature to its intended state', () => {
  const html = read('EscapeSync Phase 3.dc.html');
  assert.match(html, /EscapeSync Phase 2\.dc\.html#crew/);
  assert.match(html, /EscapeSync Phase 6\.dc\.html#options/);
  assert.match(html, /\["Trip History", "demo", "history"\]/);
  assert.match(html, /\["Settings", "demo", "settings"\]/);
  assert.match(html, /onClick="\{\{ addActivity \}\}"/);
});

test('rescue, Pip, and mobile silent controls have actions', () => {
  assert.match(read('EscapeSync Phase 5.dc.html'), /onClick="\{\{ compareMap \}\}"/);
  const pip = read('EscapeSync Phase 7.dc.html');
  assert.match(pip, /onClick="\{\{ previewChange \}\}"/);
  assert.match(pip, /onClick="\{\{ voiceStop \}\}"/);
  const mobile = read('EscapeSync Phase 8.dc.html');
  for (const action of ['mobileRoute', 'mobileRescue', 'mobileKeep', 'mobileAccept', 'mobileChanges', 'shareTrip']) {
    assert.match(mobile, new RegExp(`onClick="\\{\\{ ${action} \\}\\}"`), action);
  }
});

test('DC components use native controller handlers instead of stripped data actions', () => {
  for (const number of [3, 5, 7, 8]) {
    const source = read(`EscapeSync Phase ${number}.dc.html`);
    assert.doesNotMatch(source, /data-action=/, `Phase ${number}`);
  }
  assert.match(read('EscapeSync Phase 3.dc.html'), /onClick="\{\{ addActivity \}\}"/);
  assert.match(read('EscapeSync Phase 3.dc.html'), /onClick="\{\{ goRescue \}\}"/);
  assert.match(read('EscapeSync Phase 5.dc.html'), /onClick="\{\{ compareMap \}\}"/);
  assert.match(read('EscapeSync Phase 7.dc.html'), /onClick="\{\{ previewChange \}\}"/);
  assert.match(read('EscapeSync Phase 8.dc.html'), /onClick="\{\{ mobileRescue \}\}"/);
});

test('demo flow uses the supported hash routes and shared clipboard fallback', () => {
  const demo = read('EscapeSync Phase 9.dc.html');
  assert.doesNotMatch(demo, /\?s=/);
  assert.match(demo, /\["Start your escape", P2, "#step-1"/);
  assert.match(demo, /\["Group preferences", P2, "#crew"/);
  assert.match(demo, /\["Compare on 3D map", P4, "#compare"/);
  assert.match(demo, /EscapeSyncApp\.copyText/);
  const shared = read('app.js');
  assert.match(shared, /aria-modal/);
  assert.match(shared, /Select and copy this demo link manually/);
});
