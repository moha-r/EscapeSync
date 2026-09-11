const test = require('node:test');
const assert = require('node:assert/strict');
const App = require('../app.js');

test('route builds a phase URL with a hash', () => {
  assert.equal(App.route('rescue', 'compare'), 'EscapeSync Phase 5.dc.html#compare');
});

test('route rejects unknown destinations', () => {
  assert.throws(() => App.route('missing'), /Unknown EscapeSync route/);
});

test('normalizeState recovers defaults from invalid values', () => {
  const state = App.normalizeState({ travellers: 0, budgetPerPerson: 'bad' });
  assert.equal(state.travellers, 4);
  assert.equal(state.budgetPerPerson, 600);
});

test('mergeState preserves defaults and accepts trip edits', () => {
  const state = App.mergeState(App.DEFAULT_STATE, { destination: 'Penang', travellers: 2 });
  assert.equal(state.destination, 'Penang');
  assert.equal(state.travellers, 2);
  assert.equal(state.origin, 'Kuala Lumpur');
});

test('loadState recovers when persisted JSON is corrupt', () => {
  const storage = { getItem: () => '{broken' };
  assert.deepEqual(App.loadState(storage), App.DEFAULT_STATE);
});

test('saveState normalizes and writes the versioned key', () => {
  let written;
  const storage = { setItem: (key, value) => { written = [key, value]; } };
  const state = App.saveState({ travellers: 3 }, storage);
  assert.equal(written[0], App.STORAGE_KEY);
  assert.equal(JSON.parse(written[1]).travellers, 3);
  assert.equal(state.origin, 'Kuala Lumpur');
});
