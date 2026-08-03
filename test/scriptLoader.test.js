import assert from "node:assert/strict";
import test from "node:test";

import { loadScript } from "../utils/media/script-loader.js";

test("loadScript deduplicates concurrent requests", async () => {
  const appended = [];
  globalThis.document = {
    createElement: () => {
      const listeners = {};
      return {
        addEventListener(name, callback) {
          listeners[name] = callback;
        },
        remove() {},
        trigger(name) {
          listeners[name]?.();
        },
      };
    },
    head: {
      append(script) {
        appended.push(script);
        queueMicrotask(() => script.trigger("load"));
      },
    },
  };
  const first = loadScript("https://example.com/a.js");
  const second = loadScript("https://example.com/a.js");
  assert.equal(first, second);
  await first;
  assert.equal(appended.length, 1);
});

test("loadScript rejects an empty URL", async () => {
  await assert.rejects(loadScript(""), /requires a URL/);
});
