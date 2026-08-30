import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  collectImportSpecifiers,
  graphToMermaid,
  resolveImport,
} from "../scripts/lib/architecture-graph.js";

test("collectImportSpecifiers reads static, exported, dynamic and CommonJS imports", () => {
  const source = `
    import value from "./value.js";
    export { helper } from "./helper.js";
    import("./lazy.js");
    require("external-package");
  `;

  assert.deepEqual(collectImportSpecifiers(source), [
    "./value.js",
    "./helper.js",
    "./lazy.js",
    "external-package",
  ]);
});

test("collectImportSpecifiers keeps imports when unsupported syntax needs fallback", () => {
  const source = `
    import value from "./value.js";
    const answer: number = 42;
    export { helper } from "./helper.js";
  `;

  assert.deepEqual(collectImportSpecifiers(source), [
    "./value.js",
    "./helper.js",
  ]);
});

test("resolveImport classifies packages and resolves @utils", () => {
  const rootDir = path.resolve(".");
  const importer = path.join(
    rootDir,
    "brands",
    "coral",
    "demo",
    "src",
    "main.js",
  );

  assert.deepEqual(resolveImport("rxjs/operators", importer, { rootDir }), {
    kind: "package",
    value: "rxjs",
  });
  assert.equal(
    resolveImport("@utils", importer, { rootDir }).path,
    path.join(rootDir, "utils", "index.js"),
  );
});

test("graphToMermaid renders nodes and relations", () => {
  const output = graphToMermaid({
    nodes: [
      { id: "file:a.js", path: "a.js" },
      { id: "package:x", name: "x" },
    ],
    edges: [{ from: "file:a.js", to: "package:x", relation: "depends-on" }],
  });

  assert.match(output, /flowchart LR/);
  assert.match(output, /a\.js/);
  assert.match(output, /depends-on/);
});
