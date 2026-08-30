#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import {
  buildExperimentGraph,
  buildProjectGraph,
  graphToMermaid,
} from "./lib/architecture-graph.js";
import { ROOT_DIR, resolveProjectDir } from "./lib/projects.js";

function safeName(value) {
  return value.replaceAll("/", "--").replace(/[^a-z0-9а-яё_.-]+/gi, "-");
}

function writeGraph(graph, outputBase) {
  fs.mkdirSync(path.dirname(outputBase), { recursive: true });
  fs.writeFileSync(`${outputBase}.json`, `${JSON.stringify(graph, null, 2)}\n`);
  fs.writeFileSync(`${outputBase}.mmd`, graphToMermaid(graph));
  console.log(`JSON: ${path.relative(ROOT_DIR, `${outputBase}.json`)}`);
  console.log(`Mermaid: ${path.relative(ROOT_DIR, `${outputBase}.mmd`)}`);
  console.log(`Узлы: ${graph.stats.nodes}, связи: ${graph.stats.edges}`);
}

function main() {
  const [mode = "project", projectInput] = process.argv.slice(2);
  const outputDir = path.join(ROOT_DIR, ".architecture");

  if (mode === "project") {
    writeGraph(buildProjectGraph(), path.join(outputDir, "project"));
    return;
  }

  if (mode === "experiment") {
    if (!projectInput) {
      throw new Error("Укажите проект: npm run graph:experiment -- <путь>");
    }

    const projectDir = resolveProjectDir(projectInput);
    const relativeProject = path.relative(ROOT_DIR, projectDir);
    writeGraph(
      buildExperimentGraph(projectDir),
      path.join(outputDir, "experiments", safeName(relativeProject)),
    );
    return;
  }

  throw new Error(`Неизвестный режим анализа: ${mode}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
