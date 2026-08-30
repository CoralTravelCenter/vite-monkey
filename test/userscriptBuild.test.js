import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";

import {
  finalizeUserscriptSource,
  parseUserscriptMetadata,
  validateUserscriptArtifact,
} from "../scripts/lib/userscript.js";

const metadata = `// ==UserScript==
// @name         example
// @namespace    mindbox/vite-monkey
// @match        https://example.com/*
// ==/UserScript==
`;

test("userscript finalization preserves metadata and valid JavaScript", () => {
  const scriptBody = `(function () {
  "use strict";
  document.body.dataset.message = "Привет";
})();`;
  const result = finalizeUserscriptSource(`${metadata}\n${scriptBody}\n`);

  assert.equal(result.startsWith(metadata), true);
  assert.match(result, /\/\/ @name\s+example/);
  assert.match(result, /\/\/ @namespace\s+mindbox\/vite-monkey/);
  assert.match(result, /\/\/ @match\s+https:\/\/example\.com\/\*/);

  const finalizedBody = result.slice(metadata.length).trim();
  assert.equal(finalizedBody, scriptBody);
  assert.doesNotThrow(() => new vm.Script(finalizedBody));
});

test("userscript validation checks metadata, syntax and size", () => {
  const source = `${metadata}\n(function(){})();\n`;
  const parsed = parseUserscriptMetadata(source);
  const result = validateUserscriptArtifact(source, {
    name: "example",
    match: ["https://example.com/*"],
  });

  assert.deepEqual(parsed.name, ["example"]);
  assert.deepEqual(parsed.match, ["https://example.com/*"]);
  assert.equal(result.metadata, true);
  assert.equal(result.javascript, true);
  assert.equal(result.sizeBytes, Buffer.byteLength(source));
});

test("userscript validation rejects an absent match and mismatched name", () => {
  const withoutMatch = metadata.replace(
    "// @match        https://example.com/*\n",
    "",
  );

  assert.throws(
    () =>
      validateUserscriptArtifact(`${withoutMatch}\n(()=>{})();`, {
        name: "example",
        match: ["https://example.com/*"],
      }),
    /отсутствует @match/,
  );
  assert.throws(
    () =>
      validateUserscriptArtifact(`${metadata}\n(()=>{})();`, {
        name: "another-name",
        match: ["https://example.com/*"],
      }),
    /@name должен быть "another-name"/,
  );
});

test("userscript validation rejects invalid JavaScript", () => {
  assert.throws(
    () =>
      validateUserscriptArtifact(`${metadata}\nfunction broken(`, {
        name: "example",
        match: ["https://example.com/*"],
      }),
    /Некорректный JavaScript userscript/,
  );
});

test("userscript finalization rejects input without metadata", () => {
  assert.throws(
    () => finalizeUserscriptSource("document.body.dataset.ready = 'true';"),
    /metadata block не найден/,
  );
});

test("userscript finalization separates strict mode from a leading IIFE", () => {
  const result = finalizeUserscriptSource(
    `${metadata}\n(function() {\n  "use strict"(function() {})();\n})();`,
  );
  const finalizedBody = result.slice(metadata.length);

  assert.match(finalizedBody, /"use strict";/);
  assert.doesNotThrow(() => new vm.Script(finalizedBody).runInNewContext());
});

test("userscript finalization repairs minified strict mode before an IIFE", () => {
  const result = finalizeUserscriptSource(
    `${metadata}\n(function(){\`use strict\`(function(){})()})();`,
  );
  const finalizedBody = result.slice(metadata.length);

  assert.match(finalizedBody, /`use strict`;/);
  assert.doesNotThrow(() => new vm.Script(finalizedBody).runInNewContext());
});
