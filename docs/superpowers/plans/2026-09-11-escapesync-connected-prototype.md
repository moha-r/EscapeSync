# EscapeSync Connected Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect all EscapeSync pages into one persistent, fully interactive simulated product flow in which every visible button has an observable result.

**Architecture:** Keep the nine existing `.dc.html` pages and their local DCLogic controllers. Add a dependency-free `app.js` browser/CommonJS module for routes, persistent trip state, shared dialogs, toasts, and fallback button actions; patch each page controller only where it owns stateful behavior.

**Tech Stack:** Static HTML, vanilla JavaScript, DCLogic runtime, Leaflet/OpenStreetMap, Node.js built-in test runner, gstack browse smoke testing.

---

## File map

- Create `app.js`: route constants, state normalization and persistence, navigation, shared dialog/toast UI, delegated fallback actions.
- Create `tests/app.test.js`: unit tests for route construction, state recovery, merge semantics, and page aliases.
- Create `tests/pages.test.js`: structural checks for script inclusion, local targets, and unresolved dynamic URL attributes.
- Modify `EscapeSync Home.html`: redirect the bundled duplicate to the canonical landing page.
- Modify `EscapeSync Phase 1.dc.html`: shared runtime include, landing navigation, CTA actions, missing hero fallback.
- Modify `EscapeSync Phase 2.dc.html`: hydrate/persist trip-builder state and route completion to Phase 3.
- Modify `EscapeSync Phase 3.dc.html`: correct hub destinations, state-aware display, dead-button actions, SVG/image binding repair.
- Modify `EscapeSync Phase 4.dc.html`: state-aware back route, comparison mode, image binding repair, map fallback.
- Modify `EscapeSync Phase 5.dc.html`: comparison navigation and accepted rescue persistence.
- Modify `EscapeSync Phase 6.dc.html`: persist simulated budget/recommendation actions and return to Phase 3.
- Modify `EscapeSync Phase 7.dc.html`: wire preview and simulated voice controls.
- Modify `EscapeSync Phase 8.dc.html`: wire every mobile CTA to an internal screen or matching phase.
- Modify `EscapeSync Phase 9.dc.html`: correct demo URLs and share fallbacks.

### Task 1: Shared state and routing core

**Files:**
- Create: `tests/app.test.js`
- Create: `app.js`

- [ ] **Step 1: Write failing unit tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const App = require('../app.js');

test('route builds encoded phase URL and hash', () => {
  assert.equal(App.route('rescue', 'compare'), 'EscapeSync Phase 5.dc.html#compare');
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
```

- [ ] **Step 2: Run the unit test and verify RED**

Run: `node --test tests/app.test.js`

Expected: FAIL because `app.js` does not exist.

- [ ] **Step 3: Implement the shared core**

Implement a UMD-style `app.js` exporting `DEFAULT_STATE`, `ROUTES`, `route`, `normalizeState`, `mergeState`, `loadState`, `saveState`, `navigate`, `toast`, and `openDemo`. In browsers attach it as `window.EscapeSyncApp`; in Node assign `module.exports`.

Required route map:

```js
const ROUTES = Object.freeze({
  home: 'EscapeSync Phase 1.dc.html',
  builder: 'EscapeSync Phase 2.dc.html',
  command: 'EscapeSync Phase 3.dc.html',
  map: 'EscapeSync Phase 4.dc.html',
  rescue: 'EscapeSync Phase 5.dc.html',
  budget: 'EscapeSync Phase 6.dc.html',
  pip: 'EscapeSync Phase 7.dc.html',
  mobile: 'EscapeSync Phase 8.dc.html',
  demo: 'EscapeSync Phase 9.dc.html'
});
```

The state defaults must match the approved design: Kuala Lumpur to Melaka, four travellers, RM600/person, 88 compatibility, no accepted rescue, empty added recommendations. `loadState` catches storage and JSON errors. `openDemo` creates an accessible modal with close, Escape, and backdrop behavior. `toast` uses `role="status"`.

- [ ] **Step 4: Run the unit test and verify GREEN**

Run: `node --test tests/app.test.js`

Expected: 3 passing tests and zero failures.

### Task 2: Structural integration guardrails

**Files:**
- Create: `tests/pages.test.js`
- Modify: all nine `EscapeSync Phase *.dc.html` files

- [ ] **Step 1: Write failing structural tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pages = fs.readdirSync(root).filter((name) => /^EscapeSync Phase \d+\.dc\.html$/.test(name));

test('all nine phases load app.js', () => {
  assert.equal(pages.length, 9);
  for (const page of pages) {
    assert.match(fs.readFileSync(path.join(root, page), 'utf8'), /<script src="\.\/app\.js"><\/script>/);
  }
});

test('all local EscapeSync links resolve', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    for (const [, href] of html.matchAll(/href="(EscapeSync [^"]+\.html)(?:#[^"]*)?"/g)) {
      assert.ok(fs.existsSync(path.join(root, href)), `${page}: missing ${href}`);
    }
  }
});

test('dynamic image and SVG URL attributes are not emitted as raw templates', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.doesNotMatch(html, /(?:src|d)="\{\{\s*(?:it\.photo|sel\.photo|nextPhoto|mapRoute)\s*\}\}"/);
  }
});
```

- [ ] **Step 2: Run the structural test and verify RED**

Run: `node --test tests/pages.test.js`

Expected: FAIL because pages do not load `app.js` and raw dynamic attributes remain.

- [ ] **Step 3: Load the shared core from every phase**

Insert `<script src="./app.js"></script>` immediately after `<script src="./support.js"></script>` in phases 1–9.

- [ ] **Step 4: Repair dynamic browser attributes**

Replace raw dynamic `image-slot src` bindings with controller-produced full element markup or safe post-render property assignment. Replace the two dynamic SVG paths in Phase 3 with a static valid route path whose visual coordinates match `MAP_STOPS`; preserve controller state for the surrounding 3D map.

- [ ] **Step 5: Run structural tests and verify GREEN**

Run: `node --test tests/pages.test.js`

Expected: all structural tests pass.

### Task 3: Landing and trip creation flow

**Files:**
- Modify: `EscapeSync Home.html`
- Modify: `EscapeSync Phase 1.dc.html`
- Modify: `EscapeSync Phase 2.dc.html`
- Test: `tests/pages.test.js`

- [ ] **Step 1: Add failing assertions for canonical home and Phase 2 persistence**

Extend `tests/pages.test.js` to assert that the bundled home contains the canonical Phase 1 filename, Phase 1 contains `data-action="start-trip"`, and Phase 2 calls both `EscapeSyncApp.saveState` and `EscapeSyncApp.navigate('command')`.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/pages.test.js`

Expected: FAIL on the three new integration assertions.

- [ ] **Step 3: Wire Phase 1 and canonical home**

Add semantic `data-action` attributes to Product, Rescue Mode, Pricing, About, Sign In, Get Started, Start Your Escape, Watch How It Works, and See Plan B. Add delegated handling in `app.js`: section scrolling for Product, route navigation for builder/rescue/demo, and accessible simulated dialogs for Pricing, About, Sign In, and Watch.

Make `EscapeSync Home.html` redirect to the canonical Phase 1 file while retaining a visible fallback link.

- [ ] **Step 4: Persist and restore Phase 2**

Initialize the Phase 2 controller from `EscapeSyncApp.loadState()` for trip fields. Persist after field/select/step changes. Route the completed Balance CTA to `EscapeSyncApp.navigate('command')`. Parse `#step-N`, `#crew`, and `#balance` on initial load.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `node --test tests/app.test.js tests/pages.test.js`

Expected: all tests pass.

### Task 4: Command Center and feature branches

**Files:**
- Modify: `EscapeSync Phase 3.dc.html`
- Modify: `EscapeSync Phase 4.dc.html`
- Modify: `EscapeSync Phase 5.dc.html`
- Modify: `EscapeSync Phase 6.dc.html`
- Modify: `EscapeSync Phase 7.dc.html`
- Modify: `EscapeSync Phase 8.dc.html`

- [ ] **Step 1: Add failing route/action inventory tests**

Add assertions that Phase 3 links Crew to `#crew`, Recommendations to `#options`, Trip History to `#history`, and Settings to `#settings`; Phase 5 contains an action for Compare on Map; Phase 7 contains actions for Preview Change and the voice stop control; Phase 8 contains actions for all eight previously silent mobile buttons.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/pages.test.js`

Expected: FAIL with missing route/action markers.

- [ ] **Step 3: Wire Phase 3 and Phase 4**

Correct Phase 3 destinations and add simulated History, Settings, and Add Activity dialogs. Read shared trip and rescue state for header/health content. In Phase 4 parse web/mobile/compare hashes, preserve map controls, provide a no-Leaflet fallback panel, and route Back according to `document.referrer` or comparison state.

- [ ] **Step 4: Wire Phase 5 and Phase 6**

Make Compare on Map navigate to `map#compare`; persist the selected disruption and accepted Plan B; make Accept return to `command#updated`. In Phase 6 persist expense settlement and recommendations, give every recommendation CTA a visible success state, and route Back to Command Center.

- [ ] **Step 5: Wire Phase 7 and Phase 8**

Make Preview Change open a simulated preview and Apply Change persist the proposal. Make the voice control transition through Listening, Processing, and response states. Map all Phase 8 CTAs to an internal selected mobile screen or to Rescue/Map/Share, and add accessible labels to glyph-only controls.

- [ ] **Step 6: Run tests and verify GREEN**

Run: `node --test tests/app.test.js tests/pages.test.js`

Expected: all tests pass.

### Task 5: Demo/share and browser verification

**Files:**
- Modify: `EscapeSync Phase 9.dc.html`
- Modify: `app.js`
- Test: `tests/pages.test.js`

- [ ] **Step 1: Add failing demo route tests**

Assert that all nineteen demo hrefs resolve to existing phases and use only supported hashes; assert that the shared runtime includes clipboard fallback and accessible dialog behavior.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/pages.test.js`

Expected: FAIL until demo routes and fallbacks are complete.

- [ ] **Step 3: Complete Phase 9 and shared fallbacks**

Map every demo step to the approved phase/hash. Implement Copy Link with Clipboard API plus selectable text fallback. Implement WhatsApp and Email preview dialogs without external navigation. Toggle the existing QR view and show a status toast for every share action.

- [ ] **Step 4: Run the full automated suite**

Run: `node --test tests/*.test.js`

Expected: all tests pass with zero failures.

- [ ] **Step 5: Run browser smoke tests**

Serve the project on localhost. Visit phases 1–9 at 1440×900 and 375×812, exercise the main creation flow, each Command Center branch, Rescue through acceptance, Phase 9 demo links, and share actions. Check browser console and network after each page.

Expected: no uncaught JavaScript errors, no required local 404s, correct navigation, observable results for every button, and usable layouts at both viewports.

- [ ] **Step 6: Record the final verification**

Run: `node --test tests/*.test.js`

Expected: PASS. Record any intentionally unavailable external media separately; do not classify the optional `.image-slots.state.json` sidecar as a product failure.

