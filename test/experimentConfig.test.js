import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assertExperimentConfig,
  validateExperimentConfig,
} from "../scripts/lib/experiment-config.js";

function createFixture(t) {
  const projectDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "vite-monkey-config-"),
  );
  const entry = "src/main.js";
  fs.mkdirSync(path.join(projectDir, "src"));
  fs.writeFileSync(path.join(projectDir, entry), "export {};\n");
  t.after(() => fs.rmSync(projectDir, { recursive: true, force: true }));

  return {
    config: {
      name: "valid-experiment",
      entry,
      brand: "coral",
      match: ["https://www.coral.ru/*"],
    },
    projectDir,
  };
}

test("accepts a valid experiment config", (t) => {
  const { config, projectDir } = createFixture(t);

  assert.deepEqual(validateExperimentConfig(config, projectDir), []);
  assert.doesNotThrow(() => assertExperimentConfig(config, projectDir));
});

test("reports all invalid experiment config fields", (t) => {
  const { projectDir } = createFixture(t);
  const errors = validateExperimentConfig(
    {
      name: "Invalid name",
      entry: "src/missing.js",
      brand: "unknown",
      match: [""],
    },
    projectDir,
  );

  assert.equal(errors.length, 4);
  assert.match(errors[0], /name/);
  assert.match(errors[1], /entry не найден/);
  assert.match(errors[2], /brand/);
  assert.match(errors[3], /match/);
});

test("assertion exposes every config validation error", (t) => {
  const { projectDir } = createFixture(t);

  assert.throws(
    () =>
      assertExperimentConfig(
        { name: "", entry: "", brand: "", match: [] },
        projectDir,
      ),
    /name.*entry.*brand.*match/,
  );
});
