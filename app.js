(function (root, factory) {
  const api = factory(root && root.document ? root : null);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.EscapeSyncApp = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (browser) {
  'use strict';

  const STORAGE_KEY = 'escapesync.trip.v1';
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

  const DEFAULT_STATE = Object.freeze({
    origin: 'Kuala Lumpur',
    destination: 'Melaka',
    startDate: 'Fri, 12 Sep 2026',
    endDate: 'Sun, 14 Sep 2026',
    party: 'Friends',
    travellers: 4,
    budgetPerPerson: 600,
    styles: ['Food', 'Culture', 'Photography', 'Relaxation'],
    crew: ['Alice', 'Ben', 'Chris', 'David'],
    compatibility: 88,
    healthScore: 87,
    disruption: null,
    rescueAccepted: false,
    addedRecommendations: [],
    expenses: [],
    lastScreen: 'home'
  });

  const copyArray = (value, fallback) => Array.isArray(value) ? value.slice() : fallback.slice();
  const cleanText = (value, fallback) => typeof value === 'string' && value.trim() ? value.trim() : fallback;
  const cleanNumber = (value, fallback, min, max) => {
    const number = Number(value);
    return Number.isFinite(number) && number >= min && number <= max ? number : fallback;
  };

  function normalizeState(input) {
    const value = input && typeof input === 'object' ? input : {};
    return {
      origin: cleanText(value.origin, DEFAULT_STATE.origin),
      destination: cleanText(value.destination, DEFAULT_STATE.destination),
      startDate: cleanText(value.startDate, DEFAULT_STATE.startDate),
      endDate: cleanText(value.endDate, DEFAULT_STATE.endDate),
      party: cleanText(value.party, DEFAULT_STATE.party),
      travellers: cleanNumber(value.travellers, DEFAULT_STATE.travellers, 1, 8),
      budgetPerPerson: cleanNumber(value.budgetPerPerson, DEFAULT_STATE.budgetPerPerson, 200, 1500),
      styles: copyArray(value.styles, DEFAULT_STATE.styles),
      crew: copyArray(value.crew, DEFAULT_STATE.crew),
      compatibility: cleanNumber(value.compatibility, DEFAULT_STATE.compatibility, 0, 100),
      healthScore: cleanNumber(value.healthScore, DEFAULT_STATE.healthScore, 0, 100),
      disruption: typeof value.disruption === 'string' ? value.disruption : null,
      rescueAccepted: value.rescueAccepted === true,
      addedRecommendations: copyArray(value.addedRecommendations, DEFAULT_STATE.addedRecommendations),
      expenses: copyArray(value.expenses, DEFAULT_STATE.expenses),
      lastScreen: cleanText(value.lastScreen, DEFAULT_STATE.lastScreen)
    };
  }

  function mergeState(base, patch) {
    return normalizeState(Object.assign({}, base || DEFAULT_STATE, patch || {}));
  }

  function getStorage(storage) {
    if (storage) return storage;
    try { return browser && browser.localStorage; } catch (_) { return null; }
  }

  function loadState(storage) {
    const target = getStorage(storage);
    if (!target || typeof target.getItem !== 'function') return normalizeState(DEFAULT_STATE);
    try {
      const raw = target.getItem(STORAGE_KEY);
      return raw ? normalizeState(JSON.parse(raw)) : normalizeState(DEFAULT_STATE);
    } catch (_) {
      return normalizeState(DEFAULT_STATE);
    }
  }

  function saveState(patch, storage) {
    const target = getStorage(storage);
    const state = mergeState(loadState(target), patch);
    try { if (target && typeof target.setItem === 'function') target.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    return state;
  }

  function route(name, hash) {
    const file = ROUTES[name];
    if (!file) throw new Error('Unknown EscapeSync route: ' + name);
    const suffix = hash ? '#' + String(hash).replace(/^#/, '') : '';
    return file + suffix;
  }

  function navigate(name, hash) {
    if (!browser || !browser.location) return route(name, hash);
    saveState({ lastScreen: name + (hash ? '#' + String(hash).replace(/^#/, '') : '') });
    browser.location.href = route(name, hash);
    return browser.location.href;
  }

  function ensureStyles() {
    if (!browser || browser.document.getElementById('es-app-styles')) return;
    const style = browser.document.createElement('style');
    style.id = 'es-app-styles';
    style.textContent = '.es-action{cursor:pointer}.es-toast{position:fixed;left:50%;bottom:28px;z-index:2147483647;transform:translateX(-50%);padding:13px 18px;border-radius:999px;background:#DFFF00;color:#050A0D;font:700 13px Manrope,system-ui,sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.45)}.es-modal-backdrop{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;padding:20px;background:rgba(5,10,13,.86);backdrop-filter:blur(10px)}.es-modal{width:min(520px,100%);padding:28px;border:1px solid rgba(103,232,249,.28);border-radius:26px;background:#101B20;color:#F8FAFC;box-shadow:0 30px 90px rgba(0,0,0,.65);font-family:Manrope,system-ui,sans-serif}.es-modal h2{margin:0 0 12px;font:700 28px Space Grotesk,system-ui,sans-serif}.es-modal p{margin:0 0 22px;color:#9BA8B0;line-height:1.65}.es-modal-actions{display:flex;flex-wrap:wrap;gap:10px}.es-modal button{padding:12px 18px;border:0;border-radius:999px;background:#DFFF00;color:#050A0D;font-weight:800;cursor:pointer}.es-modal button.es-secondary{background:#142329;color:#F8FAFC;border:1px solid rgba(248,250,252,.16)}';
    browser.document.head.appendChild(style);
  }

  function toast(message) {
    if (!browser || !browser.document) return message;
    ensureStyles();
    const old = browser.document.querySelector('.es-toast');
    if (old) old.remove();
    const node = browser.document.createElement('div');
    node.className = 'es-toast';
    node.setAttribute('role', 'status');
    node.setAttribute('aria-live', 'polite');
    node.textContent = message;
    browser.document.body.appendChild(node);
    browser.setTimeout(() => node.remove(), 2400);
    return message;
  }

  function openDemo(title, message, actions) {
    if (!browser || !browser.document) return { title, message };
    ensureStyles();
    const previousFocus = browser.document.activeElement;
    const backdrop = browser.document.createElement('div');
    backdrop.className = 'es-modal-backdrop';
    const modal = browser.document.createElement('section');
    modal.className = 'es-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'es-modal-title');
    const heading = browser.document.createElement('h2');
    heading.id = 'es-modal-title';
    heading.textContent = title;
    const copy = browser.document.createElement('p');
    copy.textContent = message;
    const controls = browser.document.createElement('div');
    controls.className = 'es-modal-actions';
    const close = () => {
      browser.document.removeEventListener('keydown', onKey);
      backdrop.remove();
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    };
    const onKey = (event) => { if (event.key === 'Escape') close(); };
    const closeButton = browser.document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'es-secondary';
    closeButton.textContent = 'CLOSE';
    closeButton.addEventListener('click', close);
    for (const action of actions || []) {
      const button = browser.document.createElement('button');
      button.type = 'button';
      button.textContent = action.label;
      button.addEventListener('click', () => { close(); action.run(); });
      controls.appendChild(button);
    }
    controls.appendChild(closeButton);
    modal.append(heading, copy, controls);
    backdrop.appendChild(modal);
    backdrop.addEventListener('click', (event) => { if (event.target === backdrop) close(); });
    browser.document.addEventListener('keydown', onKey);
    browser.document.body.appendChild(backdrop);
    closeButton.focus();
    return backdrop;
  }

  async function copyText(text) {
    try {
      if (browser && browser.navigator && browser.navigator.clipboard) {
        await browser.navigator.clipboard.writeText(text);
        toast('Trip link copied');
        return true;
      }
    } catch (_) {}
    openDemo('Copy trip link', text + ' — Select and copy this demo link manually.');
    return false;
  }

  const dialogContent = {
    pricing: ['Demo pricing', 'Free prototype access. A production pricing plan has not been connected yet.'],
    about: ['About EscapeSync', 'EscapeSync keeps group trips aligned, on budget, and ready for disruptions. This is an interactive product prototype.'],
    'sign-in': ['Demo sign-in', 'Account authentication is simulated in this prototype. Continue as Alex to explore the trip.'],
    watch: ['How EscapeSync works', 'Create the trip, balance the crew, monitor trip health, then let Rescue Mode rebuild only what changed.'],
    history: ['Trip history', 'Melaka Escape is the active simulated trip. Previous trips will appear here when a backend is connected.'],
    settings: ['Demo settings', 'Notifications, currency, accessibility, and travel defaults are represented here without changing external services.'],
    'add-activity': ['Add an activity', 'A new activity has been staged for the itinerary. In this prototype it is saved as a local recommendation.'],
    'preview-change': ['Preview change', 'Pip will replace the outdoor stop with an indoor option, keep the budget buffer, and preserve the rest of the itinerary.'],
    pricingError: ['Unavailable', 'This action is not available in the prototype.']
  };

  function runAction(name, trigger) {
    const go = (routeName, hash) => navigate(routeName, hash);
    switch (name) {
      case 'home': return go('home');
      case 'start-trip': return go('builder', 'step-1');
      case 'run-demo': return go('demo');
      case 'rescue': return go('rescue');
      case 'plan-b': return go('rescue', 'plan-b');
      case 'command': return go('command');
      case 'map': return go('map');
      case 'compare-map': return go('map', 'compare');
      case 'budget': return go('budget');
      case 'recommendations': return go('budget', 'options');
      case 'crew': return go('builder', 'crew');
      case 'pip': return go('pip');
      case 'mobile': return go('mobile');
      case 'share': return go('demo', 'share');
      case 'mobile-route': return go('map', 'mobile');
      case 'mobile-rescue': return go('rescue');
      case 'mobile-changes': return go('rescue', 'compare');
      case 'mobile-accept':
        saveState({ rescueAccepted: true, healthScore: 96, lastScreen: 'mobile#rescued' });
        toast('Plan B accepted — trip updated');
        return true;
      case 'mobile-keep':
        toast('Current plan kept');
        return true;
      case 'voice-stop':
        toast('Voice request captured — Pip is preparing a reply');
        return true;
      case 'product': {
        const target = browser && browser.document.querySelector('[data-section="product"]');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return target;
      }
      case 'pricing': case 'about': case 'sign-in': case 'history': case 'settings': case 'preview-change': {
        const content = dialogContent[name];
        return openDemo(content[0], content[1]);
      }
      case 'watch': {
        const content = dialogContent.watch;
        return openDemo(content[0], content[1], [{ label: 'OPEN DEMO FLOW', run: () => go('demo') }]);
      }
      case 'add-activity': {
        const state = loadState();
        saveState({ addedRecommendations: state.addedRecommendations.concat('New activity') });
        const content = dialogContent['add-activity'];
        return openDemo(content[0], content[1]);
      }
      case 'copy-link': return copyText('https://escapesync.app/trip/7F92K');
      case 'share-whatsapp': return openDemo('WhatsApp preview', 'Melaka Escape · 3 days · Join the group at escapesync.app/trip/7F92K. Nothing was sent.');
      case 'share-email': return openDemo('Email preview', 'Subject: Join our Melaka Escape. The invitation is ready, but this prototype does not send email.');
      case 'share-qr': {
        toast('QR join code is ready');
        const panel = trigger && trigger.closest('.es-modal, body').querySelector('[data-qr-panel]');
        if (panel) panel.hidden = !panel.hidden;
        return panel;
      }
      default: return null;
    }
  }

  function init() {
    if (!browser || !browser.document || browser.__escapeSyncInit) return;
    browser.__escapeSyncInit = true;
    ensureStyles();
    browser.document.addEventListener('click', (event) => {
      const target = event.target.closest && event.target.closest('[data-action]');
      if (!target) return;
      const action = target.getAttribute('data-action');
      if (!action) return;
      event.preventDefault();
      runAction(action, target);
    });
  }

  if (browser && browser.document) {
    if (browser.document.readyState === 'loading') browser.document.addEventListener('DOMContentLoaded', init);
    else init();
  }

  return {
    STORAGE_KEY,
    ROUTES,
    DEFAULT_STATE,
    normalizeState,
    mergeState,
    loadState,
    saveState,
    route,
    navigate,
    toast,
    openDemo,
    copyText,
    runAction,
    init
  };
});
