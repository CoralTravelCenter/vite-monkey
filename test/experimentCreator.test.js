import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createExperimentFiles,
  resolveExperimentOptions,
} from "../scripts/lib/experiment-creator.js";
import { ROOT_DIR } from "../scripts/lib/projects.js";

test("creator defaults to main, CSS and the selected brand match", () => {
  assert.deepEqual(
    resolveExperimentOptions({ name: "Promo Banner", brand: "coral" }),
    {
      projectName: "promo-banner",
      brand: "coral",
      match: "https://www.coral.ru/*",
      entry: "main",
      style: "css",
    },
  );
});

test("creator supports both brands and rejects custom", () => {
  const options = resolveExperimentOptions({ name: "banner", brand: "both" });
  assert.equal(options.match, "https://www.coral.ru/*,https://www.sunmar.ru/*");
  assert.throws(
    () => resolveExperimentOptions({ name: "banner", brand: "custom" }),
    /coral, sunmar, both/,
  );
});

test("creator renders the project template in a temporary directory", (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vite-monkey-create-"));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const projectDir = path.join(tempDir, "promo-banner");
  const options = resolveExperimentOptions({
    name: "promo-banner",
    brand: "sunmar",
    entry: "home",
    style: "scss",
  });

  createExperimentFiles({
    options,
    projectDir,
    projectPath: "brands/sunmar/promo-banner",
    templateDir: path.join(ROOT_DIR, "templates", "monkey-experiment"),
  });

  assert.equal(fs.existsSync(path.join(projectDir, "src", "home.js")), true);
  assert.equal(fs.existsSync(path.join(projectDir, "src", "style.scss")), true);
  assert.deepEqual(
    JSON.parse(
      fs.readFileSync(path.join(projectDir, "experiment.config.json")),
    ),
    {
      name: "promo-banner",
      entry: "src/home.js",
      brand: "sunmar",
      match: ["https://www.sunmar.ru/*"],
    },
  );
});
