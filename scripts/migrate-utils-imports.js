#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import { ROOT_DIR } from "./lib/projects.js";

const replacements = [
  [/\bawaitDomElement\b/g, "waitForElement"],
  [/\bwaiteSelector\b/g, "waitForElement"],
  [/\bwaitSelector\b/g, "waitForElement"],
  [/\bpreloadScript\b/g, "loadScript"],
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["dist", "node_modules"].includes(entry.name)) continue;
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(filePath);
    else if (/\.[cm]?[jt]s$/.test(entry.name)) {
      const source = fs.readFileSync(filePath, "utf8");
      const next = replacements.reduce(
        (value, [pattern, replacement]) => value.replace(pattern, replacement),
        source,
      );
      if (next !== source) fs.writeFileSync(filePath, next);
    }
  }
}

walk(path.join(ROOT_DIR, "brands"));
console.log("Deprecated utils names migrated.");
