import assert from "node:assert/strict";
import test from "node:test";

import { waitForIntersection } from "../utils/dom/intersection.js";
import { waitForElement, waitForMutation } from "../utils/dom/mutation.js";

class FakeMutationObserver {
  static latest;
  constructor(callback) {
    this.callback = callback;
    this.disconnected = false;
    FakeMutationObserver.latest = this;
  }
  observe() {}
  disconnect() {
    this.disconnected = true;
  }
  emit(records = []) {
    this.callback(records, this);
  }
}

class FakeIntersectionObserver {
  static latest;
  constructor(callback) {
    this.callback = callback;
    this.disconnected = false;
    FakeIntersectionObserver.latest = this;
  }
  observe() {}
  disconnect() {
    this.disconnected = true;
  }
  emit(entries) {
    this.callback(entries, this);
  }
}

globalThis.MutationObserver = FakeMutationObserver;
globalThis.IntersectionObserver = FakeIntersectionObserver;
globalThis.Node = { DOCUMENT_NODE: 9 };

test("waitForElement resolves an existing element", async () => {
  const element = {};
  const root = { nodeType: 1, querySelector: () => element };
  assert.equal(await waitForElement(".target", { root }), element);
});

test("waitForElement resolves after a matching mutation", async () => {
  let element = null;
  const root = { nodeType: 1, querySelector: () => element };
  const promise = waitForElement(".target", { root });
  element = {};
  FakeMutationObserver.latest.emit([{}]);
  assert.equal(await promise, element);
});

test("waitForMutation applies a predicate", async () => {
  const promise = waitForMutation(
    {},
    { predicate: (records) => records.length === 2 },
  );
  FakeMutationObserver.latest.emit([{}]);
  FakeMutationObserver.latest.emit([{}, {}]);
  assert.equal((await promise).length, 2);
});

test("waitForIntersection resolves the first visible entry", async () => {
  const target = {};
  const entry = { isIntersecting: true, target };
  const promise = waitForIntersection(target);
  FakeIntersectionObserver.latest.emit([
    { isIntersecting: false, target },
    entry,
  ]);
  assert.equal(await promise, entry);
});

test("native wait wrappers reject an already aborted signal", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(waitForMutation({}, { signal: controller.signal }), {
    name: "AbortError",
  });
  await assert.rejects(waitForIntersection({}, { signal: controller.signal }), {
    name: "AbortError",
  });
});

test("native wait wrappers disconnect after a timeout", async () => {
  await assert.rejects(waitForMutation({}, { timeoutMs: 1 }), /timed out/);
  assert.equal(FakeMutationObserver.latest.disconnected, true);
});
