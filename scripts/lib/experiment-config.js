import fs from "node:fs";
import path from "node:path";

const EXPERIMENT_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const ALLOWED_BRANDS = new Set(["coral", "sunmar", "both", "custom"]);

export function validateExperimentConfig(config, projectDir) {
  const errors = [];

  if (!config?.name || !EXPERIMENT_NAME_PATTERN.test(config.name)) {
    errors.push("name должен быть в kebab-case");
  }

  if (!config?.entry || typeof config.entry !== "string") {
    errors.push("entry должен быть непустой строкой");
  } else if (!fs.existsSync(path.join(projectDir, config.entry))) {
    errors.push(`entry не найден: ${config.entry}`);
  }

  if (!ALLOWED_BRANDS.has(config?.brand)) {
    errors.push("brand должен быть одним из: coral, sunmar, both, custom");
  }

  if (
    !Array.isArray(config?.match) ||
    config.match.length === 0 ||
    config.match.some((value) => typeof value !== "string" || !value.trim())
  ) {
    errors.push("match должен быть непустым массивом непустых строк");
  }

  return errors;
}

export function assertExperimentConfig(config, projectDir) {
  const errors = validateExperimentConfig(config, projectDir);

  if (errors.length > 0) {
    throw new Error(
      `Некорректный experiment.config.json: ${errors.join("; ")}`,
    );
  }
}
