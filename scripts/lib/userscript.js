import vm from "node:vm";

const USERSCRIPT_PATTERN =
  /^(\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*)([\s\S]*)$/;
const DEFAULT_NAMESPACE = "mindbox/vite-monkey";

function splitUserscriptSource(source) {
  const match = source.match(USERSCRIPT_PATTERN);

  if (!match) {
    throw new Error("Userscript metadata block не найден.");
  }

  return { metadataSource: match[1], scriptBody: match[2] };
}

export function parseUserscriptMetadata(source) {
  const { metadataSource } = splitUserscriptSource(source);
  const metadata = {};

  for (const match of metadataSource.matchAll(/^\/\/\s+@(\S+)\s+(.+)$/gm)) {
    const [, key, value] = match;
    metadata[key] ||= [];
    metadata[key].push(value.trim());
  }

  return metadata;
}

function assertMetadataValue(metadata, key, expected) {
  const values = metadata[key] || [];

  if (values.length === 0) {
    throw new Error(`Userscript metadata: отсутствует @${key}.`);
  }

  if (!values.includes(expected)) {
    throw new Error(
      `Userscript metadata: @${key} должен быть "${expected}", получено "${values.join(", ")}".`,
    );
  }
}

export function validateUserscriptArtifact(
  source,
  { name, match, namespace = DEFAULT_NAMESPACE },
) {
  const metadata = parseUserscriptMetadata(source);
  assertMetadataValue(metadata, "name", name);
  assertMetadataValue(metadata, "namespace", namespace);

  const actualMatch = [...(metadata.match || [])].sort();
  const expectedMatch = [...match].sort();

  if (actualMatch.length === 0) {
    throw new Error("Userscript metadata: отсутствует @match.");
  }

  if (JSON.stringify(actualMatch) !== JSON.stringify(expectedMatch)) {
    throw new Error(
      `Userscript metadata: @match не соответствует experiment.config.json.`,
    );
  }

  try {
    new vm.Script(source, { filename: `${name}.user.js` });
  } catch (error) {
    throw new Error(`Некорректный JavaScript userscript: ${error.message}`, {
      cause: error,
    });
  }

  return {
    metadata: true,
    javascript: true,
    sizeBytes: Buffer.byteLength(source),
  };
}

export function finalizeUserscriptSource(source) {
  const { metadataSource, scriptBody } = splitUserscriptSource(source);
  const normalizedBody = scriptBody.replace(
    /(["'`])use strict\1(?=\s*\()/,
    "$&;",
  );

  return `${metadataSource}${normalizedBody.trimEnd()}\n`;
}
