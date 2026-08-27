import assert from "node:assert/strict";
import test from "node:test";

import {
  buildProjectOptions,
  getProjectAreaFromPath,
} from "../scripts/lib/experiment-selector.js";

const projects = [
  {
    name: "zebra",
    relativePath: "brands/coral/zebra",
  },
  {
    name: "alpha",
    relativePath: "brands/coral/alpha",
  },
  {
    name: "sunmar-promo",
    relativePath: "brands/sunmar/promo",
  },
  {
    name: "shared-banner",
    relativePath: "special/shared-banner",
  },
];

test("maps repository paths to selector areas", () => {
  assert.equal(getProjectAreaFromPath("brands/coral/promo"), "coral");
  assert.equal(getProjectAreaFromPath("brands/sunmar/promo"), "sunmar");
  assert.equal(getProjectAreaFromPath("special/promo"), "special");
  assert.equal(getProjectAreaFromPath("legacy/promo"), "special");
});

test("builds sorted project options for the selected area", () => {
  assert.deepEqual(buildProjectOptions(projects, "coral"), [
    {
      value: "brands/coral/alpha",
      label: "alpha",
      hint: "brands/coral/alpha",
    },
    {
      value: "brands/coral/zebra",
      label: "zebra",
      hint: "brands/coral/zebra",
    },
  ]);
});

test("rejects an unknown selector area", () => {
  assert.throws(
    () => buildProjectOptions(projects, "both"),
    /coral, sunmar, special/,
  );
});
