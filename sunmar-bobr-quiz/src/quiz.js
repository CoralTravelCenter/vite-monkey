const quizQuestions = [
  {
    id: "q1",
    title: "Какой отдых вам ближе?",
    answers: [
      {
        id: "q1_a1",
        text: "Максимум солнца и теплое море",
        country: "egypt",
      },
      {
        id: "q1_a2",
        text: "Подогреваемые бассейны, массаж и интересные экскурсии",
        country: "turkey",
      },
    ],
  },
  {
    id: "q2",
    title: "Что для вас главное в отдыхе у моря?",
    answers: [
      {
        id: "q2_a1",
        text: "Рифы, снорклинг, прозрачная вода",
        country: "egypt",
      },
      {
        id: "q2_a2",
        text: "Песчаные пляжи и плавный заход",
        country: "turkey",
      },
    ],
  },
  {
    id: "q3",
    title: "Какие поездки и экскурсии вы предпочитаете?",
    answers: [
      {
        id: "q3_a1",
        text: "Пустыни, сафари, дайвинг",
        country: "egypt",
      },
      {
        id: "q3_a2",
        text: "История, античные города, сувениры",
        country: "turkey",
      },
    ],
  },
];

export function createQuiz(options = {}) {
  const state = {
    currentQuestionIndex: 0,
    selectedAnswers: [],
    result: null,
    score: {
      egypt: 0,
      turkey: 0,
    },
    customer: {
      isKnown: Boolean(options.customer?.isKnown),
      email: options.customer?.email || "",
      deviceUUID: options.customer?.deviceUUID || "",
      id: options.customer?.id || "",
    },
  };

  function getCurrentQuestion() {
    return quizQuestions[state.currentQuestionIndex] || null;
  }

  function getProgress() {
    return {
      current: state.currentQuestionIndex + 1,
      total: quizQuestions.length,
    };
  }

  function selectAnswer(answerId) {
    const question = getCurrentQuestion();
    if (!question) {
      throw new Error("Текущий вопрос не найден");
    }

    const answer = question.answers.find((item) => item.id === answerId);
    if (!answer) {
      throw new Error(`Ответ ${answerId} не найден`);
    }

    state.selectedAnswers.push({
      questionId: question.id,
      answerId: answer.id,
      country: answer.country,
      text: answer.text,
    });

    state.score[answer.country] += 1;

    const isLastQuestion =
      state.currentQuestionIndex === quizQuestions.length - 1;

    if (isLastQuestion) {
      state.result = calculateResult(state.score);
      return {
        finished: true,
        result: getResultData(),
      };
    }

    state.currentQuestionIndex += 1;

    return {
      finished: false,
      nextQuestion: getCurrentQuestion(),
      progress: getProgress(),
    };
  }

  function calculateResult(score) {
    return score.egypt > score.turkey ? "egypt" : "turkey";
  }

  function getResultLabel(resultCode = state.result) {
    const labels = {
      egypt: "Египет",
      turkey: "Турция",
    };

    return labels[resultCode] || "";
  }

  function getResultData() {
    return {
      code: state.result,
      label: getResultLabel(),
      score: {...state.score},
      selectedAnswers: [...state.selectedAnswers],
      shouldAskEmail: !state.customer.isKnown,
    };
  }

  function shouldAskEmail() {
    return !state.customer.isKnown;
  }

  function setEmail(email) {
    state.customer.email = String(email || "").trim();
  }

  function getMindboxPayload() {
    if (!state.result) {
      throw new Error("Результат квиза еще не рассчитан");
    }

    return {
      deviceUUID: state.customer.deviceUUID || undefined,
      customer: {
        ids: state.customer.id
          ? {
            websiteID: state.customer.id,
          }
          : undefined,
        email: state.customer.email || undefined,
      },
      quiz: {
        result: state.result,
        resultLabel: getResultLabel(),
        answers: state.selectedAnswers.map((item) => ({
          questionId: item.questionId,
          answerId: item.answerId,
          country: item.country,
        })),
        score: {
          egypt: state.score.egypt,
          turkey: state.score.turkey,
        },
      },
    };
  }

  function reset() {
    state.currentQuestionIndex = 0;
    state.selectedAnswers = [];
    state.result = null;
    state.score = {
      egypt: 0,
      turkey: 0,
    };
  }

  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  return {
    getCurrentQuestion,
    getProgress,
    selectAnswer,
    shouldAskEmail,
    setEmail,
    getResultData,
    getMindboxPayload,
    getState,
    reset,
  };
}
