# EscapeSync Landing Mission-Control Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the EscapeSync Phase 1 hero feel like a calm, live travel mission-control surface while retaining existing user flows.

**Architecture:** Keep the static Phase 1 document and its existing actions. Add only presentational route-surface markup and CSS animations, protected with `prefers-reduced-motion`; test the required visual affordances through the existing content-level Node tests.

**Tech Stack:** Static HTML/CSS, Node.js built-in test runner.

---

### Task 1: Specify and verify the hero affordances

**Files:**
- Modify: `tests/pages.test.js`
- Modify: `EscapeSync Phase 1.dc.html`
- Test: `tests/pages.test.js`

- [ ] **Step 1: Write the failing test**

```js
test('landing hero exposes the mission-control route layer accessibly', () => {
  const landing = read('EscapeSync Phase 1.dc.html');
  assert.match(landing, /data-visual="mission-route"/);
  assert.match(landing, /data-visual="route-pulse"/);
  assert.match(landing, /prefers-reduced-motion: reduce/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/pages.test.js`

Expected: FAIL because the mission-route attributes and motion fallback do not yet exist.

- [ ] **Step 3: Implement the minimum visual markup and styles**

Add the named route surface and pulse elements within the Phase 1 hero visual, then add scoped keyframes and a reduced-motion media query in the document stylesheet. Do not edit existing `data-action` elements.

- [ ] **Step 4: Run the test suite to verify it passes**

Run: `node --test tests/app.test.js tests/pages.test.js`

Expected: PASS with no failures.

- [ ] **Step 5: Commit**

Use `git add "EscapeSync Phase 1.dc.html" tests/pages.test.js` and commit as `feat: elevate EscapeSync landing hero`.
