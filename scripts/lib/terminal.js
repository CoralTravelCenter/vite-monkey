const ANSI = {
  bold: "\u001b[1m",
  cyan: "\u001b[36m",
  dim: "\u001b[2m",
  green: "\u001b[32m",
  red: "\u001b[31m",
  reset: "\u001b[0m",
};

function paint(value, styles, enabled) {
  if (!enabled) return value;
  return `${styles.map((style) => ANSI[style]).join("")}${value}${ANSI.reset}`;
}

export function createTerminalReporter({
  stdout = process.stdout,
  stderr = process.stderr,
  color = Boolean(stdout.isTTY) && !process.env.NO_COLOR,
  now = () => performance.now(),
} = {}) {
  const writeLine = (stream, value = "") => stream.write(`${value}\n`);
  const stageDurations = [];
  let activeStage;
  let activeStageStartedAt;
  let command;
  let outputPath;
  let projectPath;
  let startedAt;
  let validation;

  const formatDuration = (durationMs) =>
    durationMs < 1000
      ? `${Math.max(1, Math.round(durationMs))} ms`
      : `${(durationMs / 1000).toFixed(2)} s`;
  const finishActiveStage = (finishedAt) => {
    if (!activeStage) return;
    stageDurations.push({
      label: activeStage,
      durationMs: finishedAt - activeStageStartedAt,
    });
    activeStage = undefined;
  };

  return {
    start(experiment) {
      const {
        command: currentCommand,
        config,
        outputPath: currentOutputPath,
      } = experiment;
      startedAt = now();
      projectPath = config.relativePath;
      command = currentCommand;
      outputPath = currentOutputPath;
      const mode = command.toUpperCase();
      writeLine(
        stdout,
        `${paint("╭─", ["cyan"], color)} ${paint("◆ Vite Monkey", ["bold"], color)} ${paint(`· ${mode}`, ["dim"], color)}`,
      );
      writeLine(
        stdout,
        `${paint("│", ["cyan"], color)}  ${paint("Проект", ["dim"], color)}   ${paint(config.name, ["bold"], color)}`,
      );
      writeLine(
        stdout,
        `${paint("│", ["cyan"], color)}  ${paint("Путь", ["dim"], color)}     ${config.relativePath}`,
      );
      writeLine(
        stdout,
        `${paint("│", ["cyan"], color)}  ${paint("Entry", ["dim"], color)}    ${config.entry}`,
      );
      writeLine(
        stdout,
        `${paint("│", ["cyan"], color)}  ${paint("Match", ["dim"], color)}    ${config.match.join(", ")}`,
      );

      if (command === "build") {
        writeLine(
          stdout,
          `${paint("│", ["cyan"], color)}  ${paint("Output", ["dim"], color)}   ${outputPath}`,
        );
      } else {
        writeLine(
          stdout,
          `${paint("│", ["cyan"], color)}  ${paint("Режим", ["dim"], color)}    Dev server + HMR`,
        );
      }

      writeLine(stdout, paint("╰─", ["cyan"], color));
      writeLine(stdout);
    },

    stage(stage) {
      const stageStartedAt = now();
      finishActiveStage(stageStartedAt);
      const labels = {
        prepare: "Подготовка",
        dev: "Запуск dev server",
        build: "Сборка",
        verify: "Проверка и упаковка",
      };

      activeStage = labels[stage] || stage;
      activeStageStartedAt = stageStartedAt;
    },

    validation(result) {
      validation = result;
      const { metadata, javascript, html, sizeBytes } = result;
      const check = paint("✓", ["green"], color);
      writeLine(
        stdout,
        `  ${paint("Metadata", ["dim"], color)}   ${metadata ? check : "—"}`,
      );
      writeLine(
        stdout,
        `  ${paint("JavaScript", ["dim"], color)} ${javascript ? check : "—"}`,
      );
      writeLine(
        stdout,
        `  ${paint("HTML", ["dim"], color)}       ${html ? check : "—"}`,
      );
      writeLine(
        stdout,
        `  ${paint("Размер", ["dim"], color)}     ${(sizeBytes / 1000).toFixed(2)} kB`,
      );
    },

    success() {
      const finishedAt = now();
      finishActiveStage(finishedAt);
      const message =
        command === "build"
          ? "Готово · HTML опубликован"
          : "Dev server остановлен";
      writeLine(stdout);
      writeLine(
        stdout,
        `${paint("╭─ ✓", ["green", "bold"], color)} ${message}`,
      );
      if (command === "build") {
        writeLine(
          stdout,
          `${paint("│", ["green"], color)}  Output   ${outputPath}`,
        );
        writeLine(
          stdout,
          `${paint("│", ["green"], color)}  Размер   ${(validation.sizeBytes / 1000).toFixed(2)} kB`,
        );
      }
      for (const stage of stageDurations) {
        writeLine(
          stdout,
          `${paint("│", ["green"], color)}  ${stage.label} · ${formatDuration(stage.durationMs)}`,
        );
      }
      writeLine(
        stdout,
        `${paint("│", ["green"], color)}  Всего    ${formatDuration(finishedAt - startedAt)}`,
      );
      writeLine(
        stdout,
        `${paint("│", ["green"], color)}  Повтор   npm run ${command} -- ${JSON.stringify(projectPath)}`,
      );
      writeLine(stdout, paint("╰─", ["green"], color));
    },

    error(error) {
      writeLine(stderr);
      writeLine(
        stderr,
        `${paint("✗ Ошибка", ["red", "bold"], color)}: ${error.message}`,
      );
    },
  };
}
