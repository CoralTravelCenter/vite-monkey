export const PIPELINE_CASES = [
  {
    area: "coral",
    projectPath: "brands/coral/comment-injection",
  },
  {
    area: "sunmar",
    projectPath: "brands/sunmar/timer",
  },
  {
    area: "both",
    projectPath: "special/test",
  },
];

export async function runPipelineCheck({
  cases = PIPELINE_CASES,
  prepare,
  execute,
  onCase = () => {},
}) {
  const results = [];

  for (const pipelineCase of cases) {
    onCase(pipelineCase);

    try {
      const experiment = prepare("build", pipelineCase.projectPath);
      const result = await execute(experiment);

      if (!result.validation?.metadata || !result.validation?.javascript) {
        throw new Error("build завершён без успешной валидации артефакта");
      }

      results.push({
        ...pipelineCase,
        name: experiment.config.name,
        sizeBytes: result.validation.sizeBytes,
      });
    } catch (error) {
      throw new Error(
        `Pipeline ${pipelineCase.area} (${pipelineCase.projectPath}): ${error.message}`,
        { cause: error },
      );
    }
  }

  return results;
}
