import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

import { ROOT_DIR } from "./projects.js";
import { getRunnerViteConfigPath } from "./runner-workspace.js";

export function getViteCliPath() {
  return path.join(ROOT_DIR, "node_modules", "vite", "bin", "vite.js");
}

export function createViteCliArgs(command, configPath, viteCliPath) {
  return [
    viteCliPath,
    ...(command === "build" ? ["build"] : []),
    "--config",
    configPath,
  ];
}

export class ViteProcessError extends Error {
  constructor(message, exitCode = 1, options) {
    super(message, options);
    this.name = "ViteProcessError";
    this.exitCode = exitCode;
  }
}

export function isExpectedDevStop(command, result) {
  if (command !== "dev") return false;

  return (
    ["SIGINT", "SIGTERM"].includes(result.signal) ||
    [130, 143].includes(result.status)
  );
}

function waitForViteProcess(child, processTarget = process) {
  return new Promise((resolve, reject) => {
    const forwardSignal = (signal) => {
      if (!child.killed) child.kill(signal);
    };
    const onSigint = () => forwardSignal("SIGINT");
    const onSigterm = () => forwardSignal("SIGTERM");

    const cleanup = () => {
      processTarget.removeListener("SIGINT", onSigint);
      processTarget.removeListener("SIGTERM", onSigterm);
    };

    processTarget.on("SIGINT", onSigint);
    processTarget.on("SIGTERM", onSigterm);

    child.once("error", (error) => {
      cleanup();
      reject(error);
    });
    child.once("exit", (status, signal) => {
      cleanup();
      resolve({ status, signal });
    });
  });
}

export async function runVite(
  command,
  configPath,
  {
    fileExists = fs.existsSync,
    spawnProcess = spawn,
    processTarget = process,
    viteCliPath = getViteCliPath(),
  } = {},
) {
  if (!fileExists(viteCliPath)) {
    throw new ViteProcessError(
      "Vite не найден в корневом node_modules. Выполни npm install в корне репозитория.",
    );
  }

  const args = createViteCliArgs(command, configPath, viteCliPath);
  const child = spawnProcess(process.execPath, args, {
    cwd: ROOT_DIR,
    stdio: "inherit",
  });
  let result;

  try {
    result = await waitForViteProcess(child, processTarget);
  } catch (error) {
    throw new ViteProcessError(
      `Не удалось запустить Vite: ${error.message}`,
      1,
      { cause: error },
    );
  }

  if (isExpectedDevStop(command, result)) {
    return result;
  }

  if (result.signal) {
    const signalExitCode = result.signal === "SIGINT" ? 130 : 143;
    throw new ViteProcessError(
      `Vite прерван сигналом ${result.signal}.`,
      signalExitCode,
    );
  }

  if (result.status !== 0) {
    throw new ViteProcessError(
      `Vite завершился с кодом ${result.status ?? 1}.`,
      result.status || 1,
    );
  }

  return result;
}

export function createRunnerViteConfigSource(config, command) {
  if (!["dev", "build"].includes(command)) {
    throw new Error("Режим Vite config должен быть dev или build.");
  }

  if (command === "build" && !config.buildOutDir) {
    throw new Error("Для build Vite config не указан staging outDir.");
  }

  const entryPath = path.join(config.projectDir, config.entry);
  const viteModeConfig =
    command === "dev"
      ? `  server: {
    port: 5173,
    strictPort: false,
    open: '/__vite-plugin-monkey.install.user.js',
  },`
      : `  build: {
    outDir: ${JSON.stringify(config.buildOutDir)},
    emptyOutDir: true,
    minify: 'oxc',
    cssMinify: true,
  },`;
  const monkeyModeConfig =
    command === "dev"
      ? `      server: {
        open: false,
      },`
      : `      build: {
        fileName: ${JSON.stringify(`${config.name}.user.js`)},
      },`;

  return `import fs from 'node:fs';

import Typograf from 'typograf';
import {defineConfig} from 'vite';
import monkey from 'vite-plugin-monkey';

const typograf = new Typograf({
  locale: ['ru', 'en-US'],
  htmlEntity: {type: 'name'},
});

const htmlTypograf = {
  name: 'html-typograf',
  enforce: 'pre',
  load(id) {
    const [filePath, query = ''] = id.split('?');

    if (!filePath.endsWith('.html') || !query.split('&').includes('raw')) {
      return null;
    }

    const source = fs.readFileSync(filePath, 'utf8');
    return 'export default ' + JSON.stringify(typograf.execute(source)) + ';';
  },
};

export default defineConfig({
  root: ${JSON.stringify(config.projectDir)},
  publicDir: false,

${viteModeConfig}

  resolve: {
    alias: {
      '@utils': ${JSON.stringify(path.join(ROOT_DIR, "utils"))},
    },
  },

  plugins: [
    htmlTypograf,

    monkey({
      entry: ${JSON.stringify(entryPath)},

      userscript: {
        name: ${JSON.stringify(config.name)},
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'mindbox/vite-monkey',
        match: ${JSON.stringify(config.match, null, 8)},
      },

${monkeyModeConfig}
    }),
  ],
});
`;
}

export function createRunnerViteConfig(config, workspaceDir, command) {
  const configPath = getRunnerViteConfigPath(workspaceDir);
  fs.writeFileSync(configPath, createRunnerViteConfigSource(config, command));

  return configPath;
}
