#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import { ROOT_DIR } from "./lib/projects.js";

const deprecated = [
  /\bawaitDomElement\b/,
  /\bwaiteSelector\b/,
  /\bwaitSelector\b/,
  /\bwaitForDLEvent\b/,
  /\bwaitForWindowVar\b/,
  /\bpreloadScript\b/,
];
const matches = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      [".git", "dist", "node_modules", ".vite-monkey-runner"].includes(
        entry.name,
      )
    )
      continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (
      /\.[cm]?[jt]s$/.test(entry.name) &&
      !fullPath.includes(`${path.sep}utils${path.sep}`)
    ) {
      const lines = fs.readFileSync(fullPath, "utf8").split("\n");
      lines.forEach((line, index) => {
        if (deprecated.some((pattern) => pattern.test(line))) {
          matches.push(`${path.relative(ROOT_DIR, fullPath)}:${index + 1}`);
        }
      });
    }
  }
}

walk(path.join(ROOT_DIR, "brands"));
if (matches.length) {
  console.error(`Deprecated utils imports/usages:\n${matches.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("No deprecated utils usages found.");
}
