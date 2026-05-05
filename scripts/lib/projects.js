const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const BRANDS_DIR = path.join(ROOT_DIR, 'brands');
const SPECIAL_DIR = path.join(ROOT_DIR, 'special');

const ROOT_INFRASTRUCTURE_DIRS = new Set([
  '.git',
  '.idea',
  '.vite-monkey-runner',
  'brands',
  'dist',
  'docs',
  'node_modules',
  'scripts',
  'special',
  'templates',
  'utils',
]);

const WALK_IGNORED_DIRS = new Set([
  '.git',
  '.idea',
  '.vite-monkey-runner',
  'docs',
  'dist',
  'node_modules',
  'scripts',
  'templates',
  'utils',
]);

const GENERIC_PACKAGE_NAMES = new Set([
  'home-page',
  'info-actions',
  'link',
  'popup',
  'search-card',
  'ym-banner',
]);

function normalizePath(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function pathExists(targetPath) {
  return fs.existsSync(targetPath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function toProjectSlug(value) {
  return value
    .split('/')
    .join('-')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function isProjectDir(projectDir) {
  return (
    pathExists(path.join(projectDir, 'experiment.config.json')) ||
    pathExists(path.join(projectDir, 'package.json'))
  );
}

function walkDirectories(dir, result = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (WALK_IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    result.push(fullPath);
    walkDirectories(fullPath, result);
  }

  return result;
}

function listProjectDirs({legacyOnly = false} = {}) {
  const directories = walkDirectories(ROOT_DIR);
  const projectDirs = directories.filter((dir) => {
    if (legacyOnly) {
      return pathExists(path.join(dir, 'package.json'));
    }

    return isProjectDir(dir);
  });

  return [...new Set(projectDirs)].sort();
}

function readLegacyViteConfig(projectDir) {
  const jsConfig = path.join(projectDir, 'vite.config.js');
  const tsConfig = path.join(projectDir, 'vite.config.ts');

  if (pathExists(jsConfig)) {
    return fs.readFileSync(jsConfig, 'utf8');
  }

  if (pathExists(tsConfig)) {
    return fs.readFileSync(tsConfig, 'utf8');
  }

  return '';
}

function extractEntryFromViteConfig(content) {
  const match = content.match(/entry:\s*['"`]([^'"`]+)['"`]/);
  return match?.[1] || '';
}

function extractMatchFromViteConfig(content) {
  const blockMatch = content.match(/match:\s*\[([\s\S]*?)\]/m);

  if (!blockMatch) {
    return [];
  }

  return [...blockMatch[1].matchAll(/['"`]([^'"`]+)['"`]/g)]
    .map((match) => match[1])
    .filter(Boolean);
}

function inferBrandFromMatch(match) {
  const values = Array.isArray(match) ? match : [match];
  const lowerCaseValues = values
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  const hasCoral = lowerCaseValues.some((value) => value.includes('coral'));
  const hasSunmar = lowerCaseValues.some((value) => value.includes('sunmar'));

  if (hasCoral && hasSunmar) {
    return 'both';
  }

  if (hasCoral) {
    return 'coral';
  }

  if (hasSunmar) {
    return 'sunmar';
  }

  return 'unknown';
}

function inferBrandFromPath(projectPath) {
  const lowerCasePath = projectPath.toLowerCase();

  if (lowerCasePath.includes('sunmar')) {
    return 'sunmar';
  }

  if (lowerCasePath.includes('coral')) {
    return 'coral';
  }

  return 'unknown';
}

function inferBrand(projectDir) {
  const experimentConfigPath = path.join(projectDir, 'experiment.config.json');

  if (pathExists(experimentConfigPath)) {
    const experimentConfig = readJson(experimentConfigPath);
    const fromMatch = inferBrandFromMatch(experimentConfig.match || []);

    if (fromMatch !== 'unknown') {
      return fromMatch;
    }

    if (experimentConfig.brand) {
      return experimentConfig.brand;
    }
  }

  const viteConfigContent = readLegacyViteConfig(projectDir);

  if (viteConfigContent) {
    const fromMatch = inferBrandFromMatch(extractMatchFromViteConfig(viteConfigContent));

    if (fromMatch !== 'unknown') {
      return fromMatch;
    }
  }

  return inferBrandFromPath(normalizePath(path.relative(ROOT_DIR, projectDir)));
}

function inferEntry(projectDir, experimentConfig, viteConfigContent) {
  if (experimentConfig?.entry) {
    return experimentConfig.entry;
  }

  const legacyEntry = extractEntryFromViteConfig(viteConfigContent);

  if (legacyEntry) {
    return legacyEntry;
  }

  if (pathExists(path.join(projectDir, 'src', 'main.js'))) {
    return 'src/main.js';
  }

  if (pathExists(path.join(projectDir, 'src', 'main.ts'))) {
    return 'src/main.ts';
  }

  if (pathExists(path.join(projectDir, 'src', 'home.js'))) {
    return 'src/home.js';
  }

  if (pathExists(path.join(projectDir, 'src', 'home.ts'))) {
    return 'src/home.ts';
  }

  return 'src/main.js';
}

function inferMatch(projectDir, experimentConfig, viteConfigContent, brand) {
  if (Array.isArray(experimentConfig?.match) && experimentConfig.match.length > 0) {
    return experimentConfig.match;
  }

  const legacyMatch = extractMatchFromViteConfig(viteConfigContent);

  if (legacyMatch.length > 0) {
    return legacyMatch;
  }

  if (brand === 'coral') {
    return ['https://www.coral.ru/*'];
  }

  if (brand === 'sunmar') {
    return ['https://www.sunmar.ru/*'];
  }

  return [];
}

function deriveProjectName(relativePath, packageJson) {
  if (packageJson?.name && !GENERIC_PACKAGE_NAMES.has(packageJson.name)) {
    return toProjectSlug(packageJson.name);
  }

  return toProjectSlug(relativePath);
}

function getProjectMetadata(projectDir) {
  const relativePath = normalizePath(path.relative(ROOT_DIR, projectDir));
  const experimentConfigPath = path.join(projectDir, 'experiment.config.json');
  const packageJsonPath = path.join(projectDir, 'package.json');
  const experimentConfig = pathExists(experimentConfigPath) ? readJson(experimentConfigPath) : null;
  const packageJson = pathExists(packageJsonPath) ? readJson(packageJsonPath) : null;
  const viteConfigContent = readLegacyViteConfig(projectDir);
  const brand = inferBrand(projectDir);
  const entry = inferEntry(projectDir, experimentConfig, viteConfigContent);
  const match = inferMatch(projectDir, experimentConfig, viteConfigContent, brand);
  const name = experimentConfig?.name || deriveProjectName(relativePath, packageJson);

  return {
    name,
    entry,
    brand,
    match,
    projectDir,
    relativePath,
    packageName: packageJson?.name || '',
    hasExperimentConfig: Boolean(experimentConfig),
    hasLegacyPackageJson: Boolean(packageJson),
  };
}

function mapBrandToArea(brand) {
  if (brand === 'coral') {
    return 'coral';
  }

  if (brand === 'sunmar') {
    return 'sunmar';
  }

  return 'special';
}

function getProjectArea(projectDir) {
  return mapBrandToArea(inferBrand(projectDir));
}

function buildProjectDir(projectName, brand) {
  const area = mapBrandToArea(brand);

  if (area === 'special') {
    return path.join(SPECIAL_DIR, projectName);
  }

  return path.join(BRANDS_DIR, area, projectName);
}

function resolveProjectDir(projectInput) {
  const normalizedInput = normalizePath(projectInput.trim());
  const candidates = listProjectDirs();
  const exactPath = path.join(ROOT_DIR, normalizedInput);

  if (isProjectDir(exactPath)) {
    return exactPath;
  }

  const matches = candidates.filter((projectDir) => {
    const relativePath = normalizePath(path.relative(ROOT_DIR, projectDir));
    return (
      relativePath === normalizedInput ||
      path.basename(projectDir) === normalizedInput ||
      relativePath.endsWith(`/${normalizedInput}`)
    );
  });

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    const paths = matches
      .map((projectDir) => normalizePath(path.relative(ROOT_DIR, projectDir)))
      .join(', ');

    throw new Error(`Неоднозначный проект "${projectInput}". Подходят: ${paths}`);
  }

  throw new Error(`Папка проекта не найдена: ${projectInput}`);
}

function listTopLevelEntries() {
  return fs.readdirSync(ROOT_DIR, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && !ROOT_INFRASTRUCTURE_DIRS.has(entry.name))
    .map((entry) => entry.name)
    .sort();
}

module.exports = {
  ROOT_DIR,
  BRANDS_DIR,
  SPECIAL_DIR,
  ROOT_INFRASTRUCTURE_DIRS,
  buildProjectDir,
  getProjectArea,
  getProjectMetadata,
  inferBrand,
  isProjectDir,
  listProjectDirs,
  listTopLevelEntries,
  mapBrandToArea,
  normalizePath,
  pathExists,
  readJson,
  resolveProjectDir,
};
