import { getProjectMetadata, listProjectDirs } from "./projects.js";

export const PROJECT_AREA_OPTIONS = ["coral", "sunmar", "special"];

export function getProjectAreaFromPath(relativePath) {
  if (relativePath.startsWith("brands/coral/")) return "coral";
  if (relativePath.startsWith("brands/sunmar/")) return "sunmar";
  return "special";
}

export function buildProjectOptions(projects, area) {
  if (!PROJECT_AREA_OPTIONS.includes(area)) {
    throw new Error(
      `Площадка: допустимые значения ${PROJECT_AREA_OPTIONS.join(", ")}.`,
    );
  }

  return projects
    .filter((project) => getProjectAreaFromPath(project.relativePath) === area)
    .map((project) => ({
      value: project.relativePath,
      label: project.name,
      hint: project.relativePath,
    }))
    .sort((left, right) =>
      left.label.localeCompare(right.label, "ru", { sensitivity: "base" }),
    );
}

export function listProjectOptions(area) {
  const projects = listProjectDirs().map((projectDir) =>
    getProjectMetadata(projectDir),
  );

  return buildProjectOptions(projects, area);
}
