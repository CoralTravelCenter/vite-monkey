import assert from "node:assert/strict";
import test from "node:test";

import { createTerminalReporter } from "../scripts/lib/terminal.js";

function createStream() {
  let output = "";

  return {
    stream: {
      write(value) {
        output += value;
      },
    },
    value: () => output,
  };
}

test("terminal reporter prints a readable build summary", () => {
  const stdout = createStream();
  const stderr = createStream();
  const reporter = createTerminalReporter({
    stdout: stdout.stream,
    stderr: stderr.stream,
    color: false,
  });

  reporter.start({
    command: "build",
    config: {
      name: "timer",
      relativePath: "brands/coral/timer",
      entry: "src/main.js",
      match: ["https://www.coral.ru/*"],
    },
    outputPath: "brands/coral/timer/dist/timer.user.js",
  });
  reporter.stage("prepare");
  reporter.stage("build");
  reporter.stage("verify");
  reporter.validation({
    metadata: true,
    javascript: true,
    sizeBytes: 742,
  });
  reporter.success("build");

  assert.match(stdout.value(), /Vite Monkey · BUILD/);
  assert.match(stdout.value(), /Проект\s+timer/);
  assert.match(
    stdout.value(),
    /Output\s+brands\/coral\/timer\/dist\/timer\.user\.js/,
  );
  assert.match(stdout.value(), /▶ Подготовка/);
  assert.match(stdout.value(), /▶ Сборка/);
  assert.match(stdout.value(), /▶ Проверка userscript/);
  assert.match(stdout.value(), /Metadata\s+✓/);
  assert.match(stdout.value(), /JavaScript\s+✓/);
  assert.match(stdout.value(), /Размер\s+0\.74 kB/);
  assert.match(stdout.value(), /Готово · userscript опубликован/);
  assert.equal(stderr.value(), "");
});

test("terminal reporter prints errors to stderr", () => {
  const stdout = createStream();
  const stderr = createStream();
  const reporter = createTerminalReporter({
    stdout: stdout.stream,
    stderr: stderr.stream,
    color: false,
  });

  reporter.error(new Error("broken build"));

  assert.equal(stdout.value(), "");
  assert.match(stderr.value(), /✗ Ошибка: broken build/);
});

test("terminal reporter uses dev-specific lifecycle labels", () => {
  const stdout = createStream();
  const reporter = createTerminalReporter({
    stdout: stdout.stream,
    stderr: createStream().stream,
    color: false,
  });

  reporter.stage("prepare");
  reporter.stage("dev");
  reporter.success("dev");

  assert.match(stdout.value(), /▶ Подготовка/);
  assert.match(stdout.value(), /▶ Запуск dev server/);
  assert.match(stdout.value(), /✓ Dev server остановлен/);
  assert.doesNotMatch(stdout.value(), /Сборка/);
});
