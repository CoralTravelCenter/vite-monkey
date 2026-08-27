#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import * as p from "@clack/prompts";

import {
  BRAND_OPTIONS,
  ENTRY_OPTIONS,
  STYLE_OPTIONS,
  createExperimentFiles,
  resolveExperimentOptions,
} from "./lib/experiment-creator.js";
import { ROOT_DIR, buildProjectDir, normalizePath } from "./lib/projects.js";

const TEMPLATE_DIR = path.join(ROOT_DIR, "templates", "monkey-experiment");

function parseArgs(argv) {
  const result = { name: "", brand: "", match: "", entry: "", style: "" };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const optionName = {
      "--brand": "brand",
      "--match": "match",
      "--entry": "entry",
      "--style": "style",
    }[arg];

    if (optionName) result[optionName] = argv[++i] || "";
    else if (!result.name) result.name = arg;
  }

  return result;
}

function unwrapPrompt(value) {
  if (p.isCancel(value)) {
    p.cancel("Создание эксперимента отменено.");
    return null;
  }
  return value;
}

async function collectOptions(args) {
  const name =
    args.name ||
    unwrapPrompt(
      await p.text({
        message: "Имя эксперимента",
        placeholder: "promo-banner",
        validate: (value) =>
          !value.trim() ? "Укажи имя эксперимента." : undefined,
      }),
    );
  if (name === null) return null;

  const brand =
    args.brand ||
    unwrapPrompt(
      await p.select({
        message: "Площадка",
        initialValue: "coral",
        options: BRAND_OPTIONS.map((value) => ({ value, label: value })),
      }),
    );
  if (brand === null) return null;

  const entry =
    args.entry ||
    unwrapPrompt(
      await p.select({
        message: "Entry file",
        initialValue: "main",
        options: ENTRY_OPTIONS.map((value) => ({
          value,
          label: value,
          hint: value === "main" ? "по умолчанию" : undefined,
        })),
      }),
    );
  if (entry === null) return null;

  const style =
    args.style ||
    unwrapPrompt(
      await p.select({
        message: "Формат стилей",
        initialValue: "css",
        options: STYLE_OPTIONS.map((value) => ({ value, label: value })),
      }),
    );
  if (style === null) return null;

  return resolveExperimentOptions({
    name,
    brand,
    match: args.match,
    entry,
    style,
  });
}

async function main() {
  p.intro("Создание Vite Monkey эксперимента");

  const options = await collectOptions(parseArgs(process.argv.slice(2)));
  if (!options) return;

  const projectDir = buildProjectDir(options.projectName, options.brand);
  const projectPath = normalizePath(path.relative(ROOT_DIR, projectDir));

  if (fs.existsSync(projectDir)) {
    throw new Error(`Папка ${projectPath} уже существует.`);
  }

  const progress = p.spinner();
  progress.start("Создаю структуру проекта");
  try {
    createExperimentFiles({
      options,
      projectDir,
      projectPath,
      templateDir: TEMPLATE_DIR,
    });
    progress.stop("Структура проекта создана");
  } catch (error) {
    progress.error("Не удалось создать проект");
    throw error;
  }

  p.note(
    [
      `Папка: ${projectPath}`,
      `Entry: src/${options.entry}.js`,
      `Style: src/style.${options.style}`,
      "",
      `npm run dev:experiment -- ${projectPath}`,
      `npm run build:experiment -- ${projectPath}`,
    ].join("\n"),
    options.projectName,
  );
  p.outro("Эксперимент готов");
}

main().catch((error) => {
  p.log.error(error.message);
  process.exitCode = 1;
});
