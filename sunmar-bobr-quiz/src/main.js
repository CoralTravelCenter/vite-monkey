import markup from './markup.html?raw'
import './style.css';
import {createQuiz} from "./quiz.js";


(async () => {
  document.body.insertAdjacentHTML('beforeend', markup)
  await customElements.whenDefined('sunmar-popup')

  const trigger = document.getElementById('sunmar-bobr-quiz')
  const sunmar_quiz = document.getElementById('sunmar-quiz')
  if (trigger && sunmar_quiz) {
    trigger.addEventListener('click', () => {
      sunmar_quiz.show()
    })
  }


  const quiz = createQuiz({
    customer: {
      isKnown: false,
      email: "",
      deviceUUID: window.mindboxDeviceUUID || "",
    },
  });

  function renderQuestion() {
    const question = quiz.getCurrentQuestion();
    const progress = quiz.getProgress();

    document.querySelector(".quiz-progress-current").textContent =
      progress.current;

    document.querySelector(".quiz-progress-total").textContent =
      progress.total;

    document.querySelector(".quiz-title").textContent =
      question.title;

    const answersContainer = document.querySelector(".quiz-answers");
    answersContainer.innerHTML = "";

    question.answers.forEach((answer) => {
      const btn = document.createElement("button");

      btn.className = "quiz-answer";
      btn.type = "button";
      btn.textContent = answer.text;

      btn.onclick = () => {
        const result = quiz.selectAnswer(answer.id);

        if (result.finished) {
          showFinalStep(result.result);
        } else {
          renderQuestion();
        }
      };

      answersContainer.appendChild(btn);
    });
  }

  function showFinalStep(result) {
    document.querySelector(".quiz-questions").style.display = "none";

    if (quiz.shouldAskEmail()) {
      document.querySelector(".quiz-email-step").style.display = "block";
    } else {
      showResult(result);
    }
  }

  function showResult(result) {
    document.querySelector(".quiz-email-step").style.display = "none";
    document.querySelector(".quiz-result-step").style.display = "block";

    document.querySelector(".quiz-result-title").textContent =
      `Ваш идеальный отдых — ${result.label}`;
  }

  document
    .querySelector(".quiz-email-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.querySelector(".quiz-email-input").value;

      quiz.setEmail(email);

      const result = quiz.getResultData();

      showResult(result);

      const payload = quiz.getMindboxPayload();

      console.log("Отправка в Mindbox:", payload);
    });

  renderQuestion();
})()
