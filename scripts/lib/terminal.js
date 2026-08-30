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
} = {}) {
  const writeLine = (stream, value = "") => stream.write(`${value}\n`);

  return {
    start({ command, config, outputPath }) {
      const mode = command.toUpperCase();
      writeLine(
        stdout,
        `${paint("◆", ["cyan"], color)} ${paint("Vite Monkey", ["bold"], color)} ${paint(`· ${mode}`, ["dim"], color)}`,
      );
      writeLine(stdout);
      writeLine(
        stdout,
        `  ${paint("Проект", ["dim"], color)}   ${config.name}`,
      );
      writeLine(
        stdout,
        `  ${paint("Путь", ["dim"], color)}     ${config.relativePath}`,
      );
      writeLine(
        stdout,
        `  ${paint("Entry", ["dim"], color)}    ${config.entry}`,
      );
      writeLine(
        stdout,
        `  ${paint("Match", ["dim"], color)}    ${config.match.join(", ")}`,
      );

      if (command === "build") {
        writeLine(
          stdout,
          `  ${paint("Output", ["dim"], color)}   ${outputPath}`,
        );
      } else {
        writeLine(
          stdout,
          `  ${paint("Режим", ["dim"], color)}    Dev server + HMR`,
        );
      }
    },

    stage(stage) {
      const labels = {
        prepare: "Подготовка",
        dev: "Запуск dev server",
        build: "Сборка",
        verify: "Проверка userscript",
      };

      writeLine(
        stdout,
        `${paint("▶", ["cyan"], color)} ${labels[stage] || stage}`,
      );
    },

    validation({ metadata, javascript, sizeBytes }) {
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
        `  ${paint("Размер", ["dim"], color)}     ${(sizeBytes / 1000).toFixed(2)} kB`,
      );
    },

    success(command) {
      const message =
        command === "build"
          ? "Готово · userscript опубликован"
          : "Dev server остановлен";
      writeLine(stdout);
      writeLine(stdout, `${paint("✓", ["green"], color)} ${message}`);
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
