#!/usr/bin/env node

import * as p from "@clack/prompts";

import {
  assertExperimentCommand,
  executeExperiment,
  prepareExperiment,
} from "./lib/experiment-runner.js";
import {
  PROJECT_AREA_OPTIONS,
  listProjectOptions,
} from "./lib/experiment-selector.js";
import { createTerminalReporter } from "./lib/terminal.js";

function parseArgs(argv) {
  const [command, projectPath] = argv;

  return {
    command,
    projectPath,
  };
}

function unwrapPrompt(value) {
  if (p.isCancel(value)) {
    p.cancel("Запуск эксперимента отменён.");
    return null;
  }

  return value;
}

async function selectProjectPath() {
  p.intro("Запуск Vite Monkey эксперимента");

  const area = unwrapPrompt(
    await p.select({
      message: "Площадка",
      initialValue: "coral",
      options: PROJECT_AREA_OPTIONS.map((value) => ({ value, label: value })),
    }),
  );
  if (area === null) return null;

  const options = listProjectOptions(area);

  if (options.length === 0) {
    throw new Error(`Для площадки ${area} эксперименты не найдены.`);
  }

  return unwrapPrompt(
    await p.autocomplete({
      message: "Эксперимент",
      options,
      placeholder: "Начните вводить название",
    }),
  );
}

async function main() {
  const { command, projectPath } = parseArgs(process.argv.slice(2));
  assertExperimentCommand(command);

  const selectedProjectPath = projectPath || (await selectProjectPath());
  if (selectedProjectPath === null) return;

  const reporter = createTerminalReporter();
  const experiment = prepareExperiment(command, selectedProjectPath);
  reporter.start(experiment);
  const result = await executeExperiment(experiment, {
    onStage: reporter.stage,
  });
  if (result.validation) reporter.validation(result.validation);
  reporter.success(command);
}

main().catch((error) => {
  createTerminalReporter().error(error);
  process.exitCode = error.exitCode || 1;
});
