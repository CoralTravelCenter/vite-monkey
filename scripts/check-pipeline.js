#!/usr/bin/env node

import * as p from "@clack/prompts";

import {
  executeExperiment,
  prepareExperiment,
} from "./lib/experiment-runner.js";
import { runPipelineCheck } from "./lib/pipeline-check.js";

async function main() {
  p.intro("Проверка Vite Monkey pipeline");

  const results = await runPipelineCheck({
    prepare: prepareExperiment,
    execute: executeExperiment,
    onCase: ({ area, projectPath }) => p.log.step(`${area} · ${projectPath}`),
  });

  p.note(
    results
      .map(
        ({ area, name, sizeBytes }) =>
          `${area.padEnd(6)} ${name} · ${(sizeBytes / 1000).toFixed(2)} kB`,
      )
      .join("\n"),
    "Pipeline matrix",
  );
  p.outro(`Успешно: ${results.length}/${results.length}`);
}

main().catch((error) => {
  p.log.error(error.message);
  process.exitCode = error.exitCode || 1;
});
