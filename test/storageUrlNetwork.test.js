import assert from "node:assert/strict";
import test from "node:test";

import { requestJson } from "../utils/network/request.js";
import {
  getLocalStorageWithExpiry,
  setLocalStorageWithExpiry,
} from "../utils/storage/local.js";
import { runOncePerSession } from "../utils/storage/session.js";
import { params2query, queryParam } from "../utils/network/url.js";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
  };
}

test("storage helpers persist TTL values and session flags", () => {
  globalThis.localStorage = createStorage();
  globalThis.sessionStorage = createStorage();
  setLocalStorageWithExpiry("segment", "family", 1);
  assert.equal(getLocalStorageWithExpiry("segment"), "family");
  assert.equal(runOncePerSession("feature"), true);
  assert.equal(runOncePerSession("feature"), false);
});

test("expired storage values are removed", () => {
  globalThis.localStorage = createStorage();
  localStorage.setItem("expired", JSON.stringify({ value: 1, expiry: 0 }));
  assert.equal(getLocalStorageWithExpiry("expired"), null);
  assert.equal(localStorage.getItem("expired"), null);
});

test("URL helpers decode values and serialize objects", () => {
  assert.equal(queryParam("count", "https://example.com/?count=2"), 2);
  assert.equal(params2query({ filters: ["sea"] }), "filters=%5B%22sea%22%5D");
});

test("requestJson returns JSON and rejects failed responses", async () => {
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ ok: true }),
  });
  assert.deepEqual(await requestJson("/endpoint"), { ok: true });
  globalThis.fetch = async () => ({
    ok: false,
    status: 500,
    statusText: "Server Error",
  });
  await assert.rejects(requestJson("/endpoint"), /500 Server Error/);
});
