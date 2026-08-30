import assert from "node:assert/strict";
import test from "node:test";

import {
  PIPELINE_CASES,
  runPipelineCheck,
} from "../scripts/lib/pipeline-check.js";

test("pipeline matrix covers coral, sunmar and both", () => {
  assert.deepEqual(
    PIPELINE_CASES.map((pipelineCase) => pipelineCase.area),
    ["coral", "sunmar", "both"],
  );
  assert.equal(new Set(PIPELINE_CASES.map((item) => item.projectPath)).size, 3);
});

test("pipeline check builds and validates every matrix case", async () => {
  const prepared = [];
  const executed = [];
  const reported = [];
  const results = await runPipelineCheck({
    prepare(command, projectPath) {
      prepared.push({ command, projectPath });
      return { command, config: { name: projectPath } };
    },
    async execute(experiment) {
      executed.push(experiment.config.name);
      return {
        validation: { metadata: true, javascript: true, sizeBytes: 100 },
      };
    },
    onCase: (pipelineCase) => reported.push(pipelineCase.area),
  });

  assert.equal(results.length, 3);
  assert.equal(
    prepared.every((item) => item.command === "build"),
    true,
  );
  assert.equal(executed.length, 3);
  assert.deepEqual(reported, ["coral", "sunmar", "both"]);
});

test("pipeline check reports the failed matrix case", async () => {
  await assert.rejects(
    () =>
      runPipelineCheck({
        cases: [{ area: "coral", projectPath: "brands/coral/example" }],
        prepare: () => ({ config: { name: "example" } }),
        execute: async () => ({ validation: null }),
      }),
    /Pipeline coral.*без успешной валидации/,
  );
});
