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
    now: (() => {
      const values = [0, 10, 30, 80, 100];
      return () => values.shift();
    })(),
  });
  reporter.start({
    command: "build",
    config: {
      name: "timer",
      relativePath: "brands/coral/timer",
      entry: "src/main.js",
      match: ["https://www.coral.ru/*"],
    },
    outputPath: "brands/coral/timer/dist/timer.html",
  });
  reporter.stage("prepare");
  reporter.stage("build");
  reporter.stage("verify");
  reporter.validation({
    metadata: true,
    javascript: true,
    html: true,
    sizeBytes: 761,
  });
  reporter.success();

  assert.match(stdout.value(), /╭─ ◆ Vite Monkey · BUILD/);
  assert.match(stdout.value(), /Проект\s+timer/);
  assert.match(
    stdout.value(),
    /Output\s+brands\/coral\/timer\/dist\/timer\.html/,
  );
  assert.doesNotMatch(stdout.value(), /▶/);
  assert.doesNotMatch(stdout.value(), /Запуск a1b2c3d4/);
  assert.match(stdout.value(), /Metadata\s+✓/);
  assert.match(stdout.value(), /JavaScript\s+✓/);
  assert.match(stdout.value(), /HTML\s+✓/);
  assert.match(stdout.value(), /Размер\s+0\.76 kB/);
  assert.match(stdout.value(), /Готово · HTML опубликован/);
  assert.match(
    stdout.value(),
    /Output\s+brands\/coral\/timer\/dist\/timer\.html/,
  );
  assert.match(stdout.value(), /Подготовка · 20 ms/);
  assert.match(stdout.value(), /Сборка · 50 ms/);
  assert.match(stdout.value(), /Проверка и упаковка · 20 ms/);
  assert.match(stdout.value(), /Всего\s+100 ms/);
  assert.match(
    stdout.value(),
    /Повтор\s+npm run build -- "brands\/coral\/timer"/,
  );
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
    now: (() => {
      const values = [0, 0, 5, 1000];
      return () => values.shift();
    })(),
  });

  reporter.start({
    command: "dev",
    config: {
      name: "timer",
      relativePath: "brands/coral/timer",
      entry: "src/main.js",
      match: ["https://www.coral.ru/*"],
    },
  });
  reporter.stage("prepare");
  reporter.stage("dev");
  reporter.success();

  assert.doesNotMatch(stdout.value(), /▶/);
  assert.match(stdout.value(), /✓ Dev server остановлен/);
  assert.match(stdout.value(), /Всего\s+1\.00 s/);
  assert.match(
    stdout.value(),
    /Повтор\s+npm run dev -- "brands\/coral\/timer"/,
  );
  assert.doesNotMatch(stdout.value(), /Сборка/);
});
