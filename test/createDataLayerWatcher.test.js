import assert from "node:assert/strict";
import test from "node:test";

globalThis.window = {};
const { createDataLayerWatcher } =
  await import("../utils/analytics/createDataLayerWatcher.js");

test("replays history and tracks the last event", async () => {
  window.dataLayer = [{ event: "view_item", id: 1 }];
  const watcher = createDataLayerWatcher();
  assert.equal((await watcher.waitEvent("view_item")).id, 1);
  assert.equal(watcher.getLastEvent("view_item").id, 1);
  watcher.destroy();
});

test("waitFreshEvent ignores history and resolves on a new push", async () => {
  window.dataLayer = [{ event: "purchase", id: 1 }];
  const watcher = createDataLayerWatcher();
  const promise = watcher.waitFreshEvent("purchase");
  window.dataLayer.push({ event: "purchase", id: 2 });
  assert.equal((await promise).id, 2);
  watcher.destroy();
});

test("waitEvent supports waiting without a timeout", async () => {
  window.dataLayer = [];
  const watcher = createDataLayerWatcher();
  const promise = watcher.waitEvent("purchase", { timeoutMs: 0 });
  window.dataLayer.push({ event: "purchase", id: 3 });
  assert.equal((await promise).id, 3);
  watcher.destroy();
});

test("keeps independent watchers for different dataLayer names", () => {
  window.firstLayer = [];
  window.secondLayer = [];
  const first = createDataLayerWatcher({ dataLayerName: "firstLayer" });
  const second = createDataLayerWatcher({ dataLayerName: "secondLayer" });
  assert.notEqual(first, second);
  first.destroy();
  second.destroy();
});

test("destroy restores the original dataLayer push", () => {
  window.dataLayer = [];
  const originalPush = window.dataLayer.push;
  const watcher = createDataLayerWatcher();
  watcher.destroy();
  assert.equal(window.dataLayer.push, originalPush);
});
