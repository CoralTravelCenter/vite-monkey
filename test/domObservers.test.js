import assert from "node:assert/strict";
import test from "node:test";

import {
  waitForIntersection,
  watchIntersection,
} from "../utils/dom/intersection.js";
import { waitForElement, waitForMutation } from "../utils/dom/mutation.js";
import { observeIntersections$ } from "../utils/dom/observation/intersection.js";
import { observeMutations$ } from "../utils/dom/observation/mutation.js";
import { waitUntilElementsGone } from "../utils/dom/waitUntilElementsGone.js";

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
    this.targets = [];
    FakeIntersectionObserver.latest = this;
  }
  observe(target) {
    this.targets.push(target);
  }
  disconnect() {
    this.disconnected = true;
  }
  emit(entries) {
    this.callback(entries, this);
  }
}

globalThis.MutationObserver = FakeMutationObserver;
globalThis.IntersectionObserver = FakeIntersectionObserver;
globalThis.Node = class Node {
  static DOCUMENT_NODE = 9;
};

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

test("waitUntilElementsGone reuses the mutation promise", async () => {
  const visible = new Set([".required"]);
  globalThis.document = {
    body: {},
    querySelector: (selector) => (visible.has(selector) ? {} : null),
  };
  let completed = false;
  const promise = waitUntilElementsGone({ required: [".required"] }, () => {
    completed = true;
  });
  visible.clear();
  FakeMutationObserver.latest.emit([{}]);
  await promise;
  assert.equal(completed, true);
});

test("waitForIntersection resolves the first visible entry", async () => {
  const target = new Node();
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

test("observation streams emit values and disconnect on unsubscribe", () => {
  const mutations = [];
  const mutationSubscription = observeMutations$({}).subscribe((records) => {
    mutations.push(records);
  });
  FakeMutationObserver.latest.emit([{}]);
  mutationSubscription.unsubscribe();

  assert.equal(mutations.length, 1);
  assert.equal(FakeMutationObserver.latest.disconnected, true);

  const intersections = [];
  const intersectionSubscription = observeIntersections$({}).subscribe(
    (entry) => intersections.push(entry),
  );
  FakeIntersectionObserver.latest.emit([{ isIntersecting: true }]);
  intersectionSubscription.unsubscribe();

  assert.equal(intersections.length, 1);
  assert.equal(FakeIntersectionObserver.latest.disconnected, true);
});

test("wait wrappers disconnect when an active signal aborts", async () => {
  const controller = new AbortController();
  const promise = waitForMutation({}, { signal: controller.signal });
  controller.abort();

  await assert.rejects(promise, { name: "AbortError" });
  assert.equal(FakeMutationObserver.latest.disconnected, true);
});

test("watchIntersection uses the shared stream and keeps disconnect compatibility", () => {
  globalThis.NodeList = class NodeList {};
  globalThis.HTMLCollection = class HTMLCollection {};
  const target = new Node();
  const states = [];
  const watcher = watchIntersection(
    [target],
    { threshold: 0.5 },
    () => states.push("visible"),
    () => states.push("hidden"),
  );

  FakeIntersectionObserver.latest.emit([
    { isIntersecting: true, target },
    { isIntersecting: false, target },
  ]);
  watcher.disconnect();

  assert.deepEqual(states, ["visible", "hidden"]);
  assert.equal(FakeIntersectionObserver.latest.disconnected, true);
});
