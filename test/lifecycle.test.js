import assert from "node:assert/strict";
import test from "node:test";

import { waitForCondition } from "../utils/lifecycle/polling.js";

test("waitForCondition resolves the first matching value", async () => {
  let calls = 0;
  const result = await waitForCondition(
    () => (++calls === 2 ? "ready" : null),
    {
      intervalMs: 0,
      timeoutMs: 100,
    },
  );
  assert.equal(result, "ready");
});
