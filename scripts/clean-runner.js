#!/usr/bin/env node

import path from "node:path";
import * as p from "@clack/prompts";

import { ROOT_DIR } from "./lib/projects.js";
import {
  listRunnerCleanupTargets,
  removeRunnerCleanupTargets,
} from "./lib/runner-workspace.js";

async function main() {
  p.intro("Очистка Vite Monkey runner");
  const targets = listRunnerCleanupTargets();

  if (targets.length === 0) {
    p.outro("Файлы для очистки не найдены");
    return;
  }

  p.note(
    targets
      .map(
        (target) => `${path.relative(ROOT_DIR, target.path)} · ${target.type}`,
      )
      .join("\n"),
    `Будет удалено: ${targets.length}`,
  );

  const confirmed = await p.confirm({
    message: "Удалить перечисленные runner-файлы?",
    initialValue: false,
  });

  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel("Очистка отменена");
    return;
  }

  removeRunnerCleanupTargets(targets);
  p.outro(`Удалено: ${targets.length}`);
}

main().catch((error) => {
  p.log.error(error.message);
  process.exitCode = 1;
});
