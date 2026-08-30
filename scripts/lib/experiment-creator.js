import fs from "node:fs";
import path from "node:path";

export const BRAND_OPTIONS = ["coral", "sunmar", "both"];
export const ENTRY_OPTIONS = ["main", "home"];
export const STYLE_OPTIONS = ["css", "scss"];

export const MATCH_PRESETS = {
  coral: "https://www.coral.ru/*",
  sunmar: "https://www.sunmar.ru/*",
  both: "https://www.coral.ru/*,https://www.sunmar.ru/*",
};

export function normalizeProjectName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function assertAllowed(value, allowedValues, fieldName) {
  if (!allowedValues.includes(value)) {
    throw new Error(
      `${fieldName}: допустимые значения ${allowedValues.join(", ")}.`,
    );
  }
}

export function resolveExperimentOptions({
  name,
  brand,
  match = "",
  entry = "main",
  style = "css",
}) {
  const projectName = normalizeProjectName(name);
  const normalizedBrand = brand.trim().toLowerCase();
  const normalizedEntry = entry.trim().toLowerCase() || "main";
  const normalizedStyle = style.trim().toLowerCase() || "css";

  if (!projectName) throw new Error("Имя проекта не может быть пустым.");
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(projectName)) {
    throw new Error(
      "Имя проекта должно быть в kebab-case: только латиница, цифры и дефисы.",
    );
  }

  assertAllowed(normalizedBrand, BRAND_OPTIONS, "Площадка");
  assertAllowed(normalizedEntry, ENTRY_OPTIONS, "Entry");
  assertAllowed(normalizedStyle, STYLE_OPTIONS, "Style");

  const resolvedMatch = match.trim() || MATCH_PRESETS[normalizedBrand];
  if (!resolvedMatch) throw new Error("match URL не может быть пустым.");

  return {
    projectName,
    brand: normalizedBrand,
    match: resolvedMatch,
    entry: normalizedEntry,
    style: normalizedStyle,
  };
}

function resolveTemplateFileName(fileName, replacements) {
  return fileName
    .replaceAll("__ENTRY_FILE__", replacements.ENTRY_FILE)
    .replaceAll("__STYLE_FILE__", replacements.STYLE_FILE);
}

function copyTemplate(sourceDir, targetDir, replacements) {
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(
      targetDir,
      resolveTemplateFileName(entry.name, replacements),
    );

    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyTemplate(sourcePath, targetPath, replacements);
      continue;
    }

    let content = fs.readFileSync(sourcePath, "utf8");
    for (const [token, value] of Object.entries(replacements)) {
      content = content.replaceAll(`__${token}__`, value);
    }
    fs.writeFileSync(targetPath, content);
  }
}

function formatJsonArray(value) {
  return JSON.stringify(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    null,
    2,
  )
    .split("\n")
    .map((line, index) => (index === 0 ? line : `  ${line}`))
    .join("\n");
}

export function createExperimentFiles({
  options,
  projectDir,
  projectPath,
  templateDir,
}) {
  fs.mkdirSync(projectDir, { recursive: true });
  copyTemplate(templateDir, projectDir, {
    PROJECT_NAME: options.projectName,
    PROJECT_PATH: projectPath,
    ENTRY_NAME: options.entry,
    ENTRY_FILE: `${options.entry}.js`,
    STYLE_FILE: `style.${options.style}`,
    BRAND: options.brand,
    MATCH: options.match,
    MATCH_JSON: formatJsonArray(options.match),
  });
}
