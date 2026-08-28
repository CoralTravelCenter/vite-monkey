import fs from "node:fs";
import path from "node:path";

import { parse } from "acorn";

import {
  ROOT_DIR,
  getProjectMetadata,
  listProjectDirs,
  normalizePath,
} from "./projects.js";

const CODE_EXTENSIONS = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const RESOLVE_EXTENSIONS = [
  "",
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".scss",
  ".html",
];
const INFRASTRUCTURE_DIRS = ["scripts", "utils", "templates", "test"];
const ROOT_CODE_FILES = [
  "eslint.config.js",
  "vite.config.js",
  "vite.config.ts",
];
const IGNORED_DIRS = new Set([
  ".git",
  ".vite-monkey-runner",
  "dist",
  "node_modules",
]);

function relativePath(rootDir, filePath) {
  return normalizePath(path.relative(rootDir, filePath));
}

function walkFiles(directory, result = []) {
  if (!fs.existsSync(directory)) {
    return result;
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walkFiles(fullPath, result);
    } else if (entry.isFile()) {
      result.push(fullPath);
    }
  }

  return result;
}

export function collectImportSpecifiers(source) {
  let sourceFile;

  try {
    sourceFile = parse(source, {
      ecmaVersion: "latest",
      sourceType: "module",
    });
  } catch {
    return collectImportSpecifiersFallback(source);
  }

  const imports = [];

  function visit(node) {
    if (!node || typeof node !== "object") {
      return;
    }

    if (
      [
        "ImportDeclaration",
        "ExportNamedDeclaration",
        "ExportAllDeclaration",
      ].includes(node.type) &&
      typeof node.source?.value === "string"
    ) {
      imports.push(node.source.value);
    }

    if (
      node.type === "ImportExpression" &&
      typeof node.source?.value === "string"
    ) {
      imports.push(node.source.value);
    }

    if (
      node.type === "CallExpression" &&
      node.callee?.type === "Identifier" &&
      node.callee.name === "require" &&
      typeof node.arguments?.[0]?.value === "string"
    ) {
      imports.push(node.arguments[0].value);
    }

    for (const [key, value] of Object.entries(node)) {
      if (["start", "end", "loc"].includes(key)) {
        continue;
      }

      if (Array.isArray(value)) {
        value.forEach(visit);
      } else if (value && typeof value === "object") {
        visit(value);
      }
    }
  }

  visit(sourceFile);
  return [...new Set(imports)];
}

function collectImportSpecifiersFallback(source) {
  const imports = [];
  const patterns = [
    /\b(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g,
    /\b(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      imports.push(match[1]);
    }
  }

  return [...new Set(imports)];
}

function stripQuery(specifier) {
  return specifier.split(/[?#]/, 1)[0];
}

function packageName(specifier) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

function resolveFile(candidate) {
  for (const extension of RESOLVE_EXTENSIONS) {
    const filePath = `${candidate}${extension}`;

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }

  for (const extension of RESOLVE_EXTENSIONS.slice(1)) {
    const indexPath = path.join(candidate, `index${extension}`);

    if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
      return indexPath;
    }
  }

  return null;
}

export function resolveImport(
  specifier,
  importer,
  { rootDir = ROOT_DIR, projectDir } = {},
) {
  const cleanSpecifier = stripQuery(specifier);

  if (specifier === "@utils" || specifier.startsWith("@utils/")) {
    const suffix =
      specifier === "@utils" ? "index.js" : cleanSpecifier.slice(7);
    return {
      kind: "file",
      path: resolveFile(path.join(rootDir, "utils", suffix)),
    };
  }

  if (cleanSpecifier.startsWith("/src/")) {
    return {
      kind: "file",
      path: resolveFile(path.join(projectDir, cleanSpecifier.slice(1))),
    };
  }

  if (cleanSpecifier.startsWith(".")) {
    return {
      kind: "file",
      path: resolveFile(path.resolve(path.dirname(importer), cleanSpecifier)),
    };
  }

  if (cleanSpecifier.startsWith("/")) {
    return { kind: "unresolved", value: specifier };
  }

  return { kind: "package", value: packageName(cleanSpecifier) };
}

function createGraph(scope) {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    scope,
    nodes: [],
    edges: [],
  };
}

function addNode(graph, node) {
  if (!graph.nodes.some(({ id }) => id === node.id)) {
    graph.nodes.push(node);
  }
}

function addEdge(graph, edge) {
  const existing = graph.edges.find(
    ({ from, to, relation }) =>
      from === edge.from && to === edge.to && relation === edge.relation,
  );

  if (existing) {
    existing.count = (existing.count || 1) + 1;
  } else {
    graph.edges.push(edge);
  }
}

function fileNode(rootDir, filePath) {
  const id = `file:${relativePath(rootDir, filePath)}`;
  return { id, type: "file", path: relativePath(rootDir, filePath) };
}

function packageNode(name) {
  return { id: `package:${name}`, type: "package", name };
}

function scanImports(graph, filePath, context, sourceId) {
  if (!CODE_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
    return [];
  }

  const source = fs.readFileSync(filePath, "utf8");
  const resolvedFiles = [];

  for (const specifier of collectImportSpecifiers(source, filePath)) {
    const resolved = resolveImport(specifier, filePath, context);

    if (resolved.kind === "file" && resolved.path) {
      if (
        context.collapseProject &&
        resolved.path.startsWith(`${context.projectDir}${path.sep}`)
      ) {
        continue;
      }

      const target = fileNode(context.rootDir, resolved.path);
      addNode(graph, target);
      addEdge(graph, { from: sourceId, to: target.id, relation: "imports" });
      resolvedFiles.push(resolved.path);
    } else if (resolved.kind === "package") {
      const target = packageNode(resolved.value);
      addNode(graph, target);
      addEdge(graph, { from: sourceId, to: target.id, relation: "depends-on" });
    } else {
      const id = `unresolved:${specifier}`;
      addNode(graph, { id, type: "unresolved", specifier });
      addEdge(graph, { from: sourceId, to: id, relation: "unresolved" });
    }
  }

  return resolvedFiles;
}

export function buildExperimentGraph(projectDir, { rootDir = ROOT_DIR } = {}) {
  const metadata = getProjectMetadata(projectDir);
  const graph = createGraph({
    type: "experiment",
    project: metadata.relativePath,
  });
  const entryPath = path.resolve(projectDir, metadata.entry);
  const queue = [entryPath];
  const visited = new Set();

  while (queue.length > 0) {
    const filePath = queue.shift();

    if (!filePath || visited.has(filePath) || !fs.existsSync(filePath)) {
      continue;
    }

    visited.add(filePath);
    const node = fileNode(rootDir, filePath);
    addNode(graph, { ...node, entry: filePath === entryPath });
    queue.push(
      ...scanImports(graph, filePath, { rootDir, projectDir }, node.id).filter(
        (dependency) =>
          dependency.startsWith(projectDir) ||
          dependency.startsWith(path.join(rootDir, "utils")),
      ),
    );
  }

  return finalizeGraph(graph);
}

export function buildProjectGraph({
  rootDir = ROOT_DIR,
  projectDirs = listProjectDirs(),
} = {}) {
  const graph = createGraph({ type: "repository" });

  for (const projectDir of projectDirs) {
    const metadata = getProjectMetadata(projectDir);
    const id = `project:${metadata.relativePath}`;
    const files = walkFiles(projectDir);
    addNode(graph, {
      id,
      type: "project",
      name: metadata.name,
      path: metadata.relativePath,
      brand: metadata.brand,
      entry: metadata.entry,
      fileCount: files.length,
    });

    for (const filePath of files) {
      scanImports(
        graph,
        filePath,
        { rootDir, projectDir, collapseProject: true },
        id,
      );
    }
  }

  const infrastructureFiles = INFRASTRUCTURE_DIRS.flatMap((directory) =>
    walkFiles(path.join(rootDir, directory)),
  ).concat(
    ROOT_CODE_FILES.map((file) => path.join(rootDir, file)).filter(
      fs.existsSync,
    ),
  );

  for (const filePath of infrastructureFiles) {
    if (!CODE_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
      continue;
    }

    const node = fileNode(rootDir, filePath);
    addNode(graph, node);
    scanImports(graph, filePath, { rootDir, projectDir: rootDir }, node.id);
  }

  return finalizeGraph(graph);
}

function finalizeGraph(graph) {
  graph.nodes.sort((a, b) => a.id.localeCompare(b.id));
  graph.edges.sort((a, b) =>
    `${a.from}:${a.to}`.localeCompare(`${b.from}:${b.to}`),
  );
  graph.stats = {
    nodes: graph.nodes.length,
    edges: graph.edges.length,
    projects: graph.nodes.filter(({ type }) => type === "project").length,
    files: graph.nodes.filter(({ type }) => type === "file").length,
    packages: graph.nodes.filter(({ type }) => type === "package").length,
    unresolved: graph.nodes.filter(({ type }) => type === "unresolved").length,
  };
  return graph;
}

function mermaidId(index) {
  return `n${index}`;
}

export function graphToMermaid(graph) {
  const ids = new Map(
    graph.nodes.map((node, index) => [node.id, mermaidId(index)]),
  );
  const lines = ["flowchart LR"];

  for (const node of graph.nodes) {
    const label = (
      node.path ||
      node.name ||
      node.specifier ||
      node.id
    ).replaceAll('"', "'");
    lines.push(`  ${ids.get(node.id)}["${label}"]`);
  }

  for (const edge of graph.edges) {
    lines.push(
      `  ${ids.get(edge.from)} -->|${edge.relation}| ${ids.get(edge.to)}`,
    );
  }

  return `${lines.join("\n")}\n`;
}
