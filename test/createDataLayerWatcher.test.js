import assert from "node:assert/strict";
import test from "node:test";
import { firstValueFrom } from "rxjs";

globalThis.window = {};
const { createDataLayerWatcher } =
  await import("../utils/analytics/createDataLayerWatcher.js");

test("event$ replays matching history", async () => {
  window.dataLayer = [{ event: "view_item", id: 1 }];
  const watcher = createDataLayerWatcher();
  assert.equal((await firstValueFrom(watcher.event$("view_item"))).id, 1);
  watcher.destroy();
});

test("freshEvent$ ignores history and emits a new push", async () => {
  window.dataLayer = [{ event: "purchase", id: 1 }];
  const watcher = createDataLayerWatcher();
  const promise = firstValueFrom(watcher.freshEvent$("purchase"));
  window.dataLayer.push({ event: "purchase", id: 2 });
  assert.equal((await promise).id, 2);
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
