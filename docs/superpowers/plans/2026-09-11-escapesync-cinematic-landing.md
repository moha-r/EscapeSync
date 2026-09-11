# EscapeSync Cinematic Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace EscapeSync Phase 1 with a cinematic, image-led travel-planning landing page while preserving the connected prototype flow.

**Architecture:** Keep the existing standalone DC page contract and global `app.js` actions. Build the experience with semantic HTML, scoped CSS, progressive CSS scroll animation, and native scroll-snap navigation so a failed animation or image request never blocks the page.

**Tech Stack:** HTML, CSS, existing EscapeSync runtime, Node.js built-in tests, remote Unsplash imagery.

---

### Task 1: Define the landing-page contract

**Files:**
- Modify: `tests/pages.test.js`
- Test: `tests/pages.test.js`

- [ ] **Step 1: Replace the small mission-control assertion with the full cinematic contract**

```js
test('landing delivers the cinematic travel story and connected actions', () => {
  const landing = read('EscapeSync Phase 1.dc.html');
  for (const marker of ['cinematic-hero', 'disruption-story', 'plan-b-story', 'destination-rail', 'rescue-comparison', 'final-cta']) {
    assert.match(landing, new RegExp(`data-section="${marker}"`), marker);
  }
  for (const action of ['start-trip', 'watch', 'plan-b', 'rescue', 'sign-in']) {
    assert.match(landing, new RegExp(`data-action="${action}"`), action);
  }
  assert.match(landing, /images\.unsplash\.com/);
  assert.match(landing, /scroll-snap-type/);
  assert.match(landing, /prefers-reduced-motion: reduce/);
});
```

- [ ] **Step 2: Run the page tests and confirm the new contract fails**

Run: `node --test tests/pages.test.js`

Expected: FAIL on the first missing cinematic section marker.

### Task 2: Replace Phase 1 with the cinematic page

**Files:**
- Modify: `EscapeSync Phase 1.dc.html`
- Test: `tests/pages.test.js`

- [ ] **Step 1: Build the semantic section structure**

Use this exact source order inside `<x-dc>`:

```html
<header class="site-header">...</header>
<main>
  <section data-section="cinematic-hero">...</section>
  <section data-section="disruption-story">...</section>
  <section data-section="plan-b-story">...</section>
  <section data-section="destination-rail">...</section>
  <section data-section="rescue-comparison">...</section>
  <section data-section="system">...</section>
  <section data-section="final-cta">...</section>
</main>
<footer>...</footer>
```

- [ ] **Step 2: Add the visual system and responsive behavior**

Define EscapeSync tokens, large editorial display type, full-bleed photo treatments, sticky scene layers, route overlays, scroll-snap cards, 44px controls, breakpoints for 1024px and 640px, and a `prefers-reduced-motion: reduce` rule that removes transforms and animation.

- [ ] **Step 3: Use the selected remote travel imagery**

Use the verified Unsplash image URLs for Kuala Lumpur, Melaka River, and Langkawi. Add readable gradient fallbacks and meaningful alt text to content images.

- [ ] **Step 4: Run the full tests**

Run: `node --test tests/app.test.js tests/pages.test.js`

Expected: all tests pass with zero failures.

- [ ] **Step 5: Commit the implementation**

Stage `EscapeSync Phase 1.dc.html`, `tests/pages.test.js`, and this plan. Commit as `feat: build cinematic EscapeSync landing`.

### Task 3: Browser verification

**Files:**
- Verify: `EscapeSync Phase 1.dc.html`

- [ ] **Step 1: Serve the repository locally**

Run: `python3 -m http.server 4173 --bind 127.0.0.1`

- [ ] **Step 2: Check desktop and mobile**

Open `http://127.0.0.1:4173/EscapeSync%20Phase%201.dc.html` at 1440px and 375px. Confirm the hero, all seven sections, remote images, scroll-snap rail, navigation actions, and final CTA are visible without overflow or console errors.

- [ ] **Step 3: Re-run automated verification after visual fixes**

Run: `node --test tests/app.test.js tests/pages.test.js && git diff --check`

Expected: all tests pass and `git diff --check` prints nothing.
