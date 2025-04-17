import markup from './markup.html?raw';
import './style.scss'
import {hostReactAppReady} from "../../utils.js";

document.querySelector('.carouselContainer').insertAdjacentHTML('afterend', markup);

const CORRECT_ANSWERS = ['false', 'true', 'true'];
let currentQuestionIndex = 0;

// Элементы DOM
const quizRoot = document.querySelector('#egeisk-quiz');
const counterText = quizRoot.querySelector('.counter span');
const progressBar = quizRoot.querySelector('.question__progress');
const progressBarFill = quizRoot.querySelector('.progress-bar .fill');
const nextButton = quizRoot.querySelector('.next-question');
const answerButtons = [...quizRoot.querySelectorAll('.variant')];
const answerFacts = [...quizRoot.querySelectorAll('[data-answer]')];
const questionHeadings = [...quizRoot.querySelectorAll('[data-question]')];
const endButtons = [...quizRoot.querySelectorAll('.end-before, .end-after')];
const allScreens = [...quizRoot.querySelectorAll('.quiz-screen')];
const finalScreen = quizRoot.querySelector('.final-screen');

// Инициализация
hostReactAppReady().then(() => {
  updateCounter();
  bindAnswerEvents();
  bindEndButtons();
  bindScreenSwitchers();
  bindRestartButton();
});


// Обновление счётчика текущего вопроса
function updateCounter() {
  counterText.textContent = `${currentQuestionIndex + 1}`;
}

// Показать объяснение к ответу с подсветкой правильности
function showFact(isCorrect) {
  const fact = answerFacts[currentQuestionIndex];
  fact.classList.remove('js-hidden');
  const factText = fact.querySelector('span');
  factText.style.color = isCorrect ? 'rgb(1 230 61)' : 'rgb(255 83 91)';
}

// Сбросить стили выбранных ответов
function resetAnswerStyles() {
  answerButtons.forEach(button => {
    button.classList.remove('js-true', 'js-false');
  });
}

// Переход к следующему вопросу
function goToNextQuestion() {
  answerFacts[currentQuestionIndex].classList.add('js-hidden');
  questionHeadings[currentQuestionIndex].classList.add('js-hidden');

  currentQuestionIndex++;

  // Если прошли все вопросы
  if (currentQuestionIndex >= questionHeadings.length) {
    nextButton.classList.add('js-hidden');
    quizRoot.querySelector('.end-after').classList.remove('js-hidden');
    return;
  }

  questionHeadings[currentQuestionIndex].classList.remove('js-hidden');
  progressBar.classList.remove('js-hidden');
  nextButton.classList.add('js-hidden');
  resetAnswerStyles();
  updateCounter();
  updateProgressBar();
}


// Обновить прогресс-бар
function updateProgressBar() {
  const totalQuestions = questionHeadings.length;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  progressBarFill.style.width = `${progressPercent}%`;
}


// Обработка клика по ответу
function handleAnswerClick(e) {
  const selectedButton = e.currentTarget;
  const selectedAnswer = selectedButton.getAttribute('data-variant');
  const isCorrect = selectedAnswer === CORRECT_ANSWERS[currentQuestionIndex];

  selectedButton.classList.add(isCorrect ? 'js-true' : 'js-false');
  showFact(isCorrect);
  progressBar.classList.add('js-hidden');

  // Показываем нужную кнопку: либо next, либо завершение
  if (currentQuestionIndex === questionHeadings.length - 1) {
    quizRoot.querySelector('.end-after').classList.remove('js-hidden');
  } else {
    nextButton.classList.remove('js-hidden');
  }
}


// Навешиваем события на кнопки ответов
function bindAnswerEvents() {
  answerButtons.forEach(button => {
    button.addEventListener('click', handleAnswerClick);
  });

  nextButton.addEventListener('click', goToNextQuestion);
}

// Навешиваем события на кнопки завершения игры
function bindEndButtons() {
  endButtons.forEach(button => {
    button.addEventListener('click', endQuiz);
  });
}

// Завершение викторины
function endQuiz() {
  allScreens.forEach(screen => {
    screen.classList.add('js-invisible');
  });
  finalScreen.classList.remove('js-invisible');
}


// Переключение экранов
function bindScreenSwitchers() {
  const nextScreenButtons = [...quizRoot.querySelectorAll('.next-screen')];

  nextScreenButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentScreen = button.closest('.quiz-screen');
      if (!currentScreen) return;

      currentScreen.classList.add('js-invisible');

      const nextScreen = currentScreen.nextElementSibling;
      if (nextScreen?.classList.contains('quiz-screen')) {
        nextScreen.classList.remove('js-invisible');
      }
    });
  });
}

function bindRestartButton() {
  const restartBtn = quizRoot.querySelector('.start-again');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartQuiz);
  }
}


function restartQuiz() {
  currentQuestionIndex = 0;

  // Сброс всех экранов
  const allScreens = [...quizRoot.querySelectorAll('.quiz-screen')];
  allScreens.forEach(screen => {
    screen.classList.add('js-invisible');
  });
  quizRoot.querySelector('.questions-screen')?.classList.remove('js-invisible');

  // Сброс вопросов и ответов
  questionHeadings.forEach((q, i) => {
    q.classList.toggle('js-hidden', i !== 0);
  });

  answerFacts.forEach(fact => {
    fact.classList.add('js-hidden');
  });

  resetAnswerStyles();

  // Сброс прогресс-бара и счётчика
  progressBarFill.style.width = '0%';
  updateCounter();

  // Показать нужные элементы
  nextButton.classList.add('js-hidden');
  quizRoot.querySelector('.end-after')?.classList.add('js-hidden');
  progressBar.classList.remove('js-hidden');
}
