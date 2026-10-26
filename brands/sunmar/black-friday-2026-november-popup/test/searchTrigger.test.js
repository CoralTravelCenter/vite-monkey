import assert from "node:assert/strict";
import test from "node:test";
import { watchSearchForm } from "../src/scripts/search/watchSearchForm.js";

function field(value, end, visible = true) {
  return {
    value,
    getClientRects() {
      return visible ? [{}] : [];
    },
    closest() {
      return {
        querySelector() {
          return end === undefined ? null : { value: end };
        },
      };
    },
  };
}

function setup(fields = [], path = "/packagetours/test/?qp=test") {
  const timers = new Map();
  const listeners = new Map();
  let shown = 0;
  const document = {
    fields,
    querySelectorAll() {
      return document.fields;
    },
  };
  const window = {
    location: { href: `https://www.sunmar.ru${path}` },
    setInterval(fn) {
      timers.set(1, fn);
      return 1;
    },
    clearInterval(id) {
      timers.delete(id);
    },
    addEventListener(name, fn) {
      listeners.set(name, fn);
    },
    removeEventListener(name) {
      listeners.delete(name);
    },
  };

  function showPopup() {
    shown++;
  }

  const dispose = watchSearchForm(showPopup, window, document);
  return {
    window,
    document,
    timers,
    listeners,
    dispose,
    shown() {
      return shown;
    },
    tick() {
      for (const fn of [...timers.values()]) fn();
    },
  };
}

test("reads populated fields without dataLayer", function () {
  const h = setup([field("22.11.2026", "26.11.2026")]);
  assert.equal(h.shown(), 1);
  assert.equal(h.timers.size, 0);
  assert.equal(h.listeners.size, 0);
});

test("waits for fields and React value updates", function () {
  const h = setup();
  h.tick();
  assert.equal(h.shown(), 0);
  h.document.fields = [field("20.11.2026", "26.11.2026")];
  h.tick();
  assert.equal(h.shown(), 0);
  h.document.fields[0].value = "22.11.2026";
  h.tick();
  assert.equal(h.shown(), 1);
  h.tick();
  assert.equal(h.shown(), 1);
});

test("ignores hidden fields and missing range end", function () {
  const h = setup([
    field("22.11.2026", "26.11.2026", false),
    field("22.11.2026", undefined),
  ]);
  assert.equal(h.shown(), 0);
});

test("uses end from the same date range", function () {
  const h = setup([
    field("22.11.2026", "30.11.2026"),
    field("20.11.2026", "26.11.2026"),
  ]);
  assert.equal(h.shown(), 0);
});

test("waits until navigation reaches search results", function () {
  const h = setup([field("22.11.2026", "26.11.2026")], "/");
  assert.equal(h.shown(), 0);
  h.window.location.href = "https://www.sunmar.ru/packagetours/test/?qp=test";
  h.tick();
  assert.equal(h.shown(), 1);
});

test("page exit stops polling", function () {
  const h = setup();
  h.listeners.get("pagehide")({ persisted: false });
  assert.equal(h.timers.size, 0);
  assert.equal(h.listeners.size, 0);
});

test("disposal prevents a queued callback from opening the popup", function () {
  const h = setup();
  const queuedCheck = h.timers.get(1);
  h.dispose();
  h.document.fields = [field("22.11.2026", "26.11.2026")];
  queuedCheck();
  assert.equal(h.shown(), 0);
});
