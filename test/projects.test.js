import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  ROOT_DIR,
  findProjectMatches,
  getProjectMetadata,
  resolveProjectDir,
} from "../scripts/lib/projects.js";

test("findProjectMatches supports full paths and unique short names", () => {
  const rootDir = path.join(path.sep, "repository");
  const coralProject = path.join(rootDir, "brands", "coral", "banner");
  const sunmarProject = path.join(rootDir, "brands", "sunmar", "popup");
  const candidates = [coralProject, sunmarProject];

  assert.deepEqual(
    findProjectMatches("brands/coral/banner", candidates, rootDir),
    [coralProject],
  );
  assert.deepEqual(findProjectMatches("popup", candidates, rootDir), [
    sunmarProject,
  ]);
  assert.deepEqual(
    findProjectMatches("./brands/coral/banner", candidates, rootDir),
    [coralProject],
  );
});

test("findProjectMatches returns every ambiguous short-name match", () => {
  const rootDir = path.join(path.sep, "repository");
  const candidates = [
    path.join(rootDir, "brands", "coral", "timer"),
    path.join(rootDir, "brands", "sunmar", "timer"),
  ];

  assert.deepEqual(
    findProjectMatches("timer", candidates, rootDir),
    candidates,
  );
});

test("resolveProjectDir handles real full, short and ambiguous inputs", () => {
  const expected = path.join(ROOT_DIR, "brands", "coral", "comment-injection");

  assert.equal(resolveProjectDir("brands/coral/comment-injection"), expected);
  assert.equal(resolveProjectDir("comment-injection"), expected);
  assert.throws(() => resolveProjectDir("timer"), /Неоднозначный проект/);
  assert.throws(
    () => resolveProjectDir("missing-experiment"),
    /Папка проекта не найдена/,
  );
});

test("getProjectMetadata reads the configured entry, brand and match", () => {
  const projectDir = path.join(
    ROOT_DIR,
    "brands",
    "coral",
    "comment-injection",
  );
  const metadata = getProjectMetadata(projectDir);

  assert.equal(metadata.name, "comment-injection");
  assert.equal(metadata.entry, "src/main.js");
  assert.equal(metadata.brand, "coral");
  assert.deepEqual(metadata.match, ["https://www.coral.ru/*"]);
  assert.equal(metadata.hasExperimentConfig, true);
  assert.equal(metadata.hasLegacyPackageJson, false);
});
