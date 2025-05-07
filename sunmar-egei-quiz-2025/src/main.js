import MicroModal from 'micromodal';
import {hostReactAppReady, vimeoAutoPlay} from "../../utils.js";
// import markup from './markup.html?raw'
import './style.scss'


const CORRECT_ANSWERS = ['false', 'true', 'true'];
let currentQuestionIndex = 0;

hostReactAppReady().then(() => {
  // document.querySelector('.carouselContainer').insertAdjacentHTML('afterend', markup)
// Элементы DOM
  const quizRoot = document.querySelector('#egeisk-quiz');
  const counterText = quizRoot?.querySelector('.counter span');
  const progressBar = quizRoot?.querySelector('.question__progress');
  const progressBarFill = quizRoot?.querySelector('.progress-bar .fill');
  const nextButton = quizRoot?.querySelector('.next-question');
  const answerButtons = [...quizRoot?.querySelectorAll('.variant')];
  const answerFacts = [...quizRoot?.querySelectorAll('[data-answer]')];
  const questionHeadings = [...quizRoot?.querySelectorAll('[data-question]')];
  const endButtons = [...quizRoot?.querySelectorAll('.end-before, .end-after')];
  const allScreens = [...quizRoot?.querySelectorAll('.quiz-screen')];
  const finalScreen = quizRoot?.querySelector('.final-screen');
  const videoScreen = quizRoot?.querySelector('.vimeo-video-box');
  const trigger = document?.querySelector('.popup-trigger');
  const closeTrigger = quizRoot?.querySelector('.modal__close');
  const LINK = document?.querySelector('.redirect-from-quiz');


// Инициализация

  updateCounter();
  bindAnswerEvents();
  bindEndButtons();
  bindScreenSwitchers();
  bindRestartButton();
  redirect()


  trigger.addEventListener('click', () => {
    ym(215233, 'reachGoal', 'quiz_start')
    MicroModal.show('modal-1', {
      awaitCloseAnimation: true,
      onShow: function () {
        document.body.style.overflow = 'hidden';
        ym(215233, 'reachGoal', 'quiz_start')
      },
      onClose: function () {
        document.body.style.overflow = 'auto';
      }
    });
  })

  closeTrigger.addEventListener('click', () => MicroModal.close('modal-1'))
  vimeoAutoPlay()


// Обновление счётчика текущего вопроса
  function updateCounter() {
    counterText.textContent = `${currentQuestionIndex + 1}`;
  }

// Показать объяснение к ответу с подсветкой правильности
  function showFact() {
    const fact = answerFacts[currentQuestionIndex];
    fact.classList.remove('js-hidden');
  }

// Сбросить стили выбранных ответов
  function resetAnswerStyles() {
    answerButtons.forEach(button => {
      button.classList.remove('js-true', 'js-false');
    });
  }

// Переход к следующему вопросу
  function goToNextQuestion() {
    enableAnswers()
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
    disableAnswers(selectedButton)
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
    ym(215233, 'reachGoal', 'stop_quiz', {'question': currentQuestionIndex + 1})
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
        if (nextScreen?.classList.contains('questions-screen')) {
          videoScreen.classList.add('js-invisible');
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
    enableAnswers()

    // Сброс прогресс-бара и счётчика
    progressBarFill.style.width = '0%';
    updateCounter();

    // Показать нужные элементы
    nextButton.classList.add('js-hidden');
    quizRoot.querySelector('.end-after')?.classList.add('js-hidden');
    progressBar.classList.remove('js-hidden');

    ym(215233, 'reachGoal', 'quiz_finish_page', {'button': 'play_again'})
  }

  function redirect() {
    LINK.addEventListener('click', () => {
      ym(215233, 'reachGoal', 'quiz_finish_page', {'button': 'select_tour'})
      window.open('https://www.sunmar.ru/packagetours/moskva-to-3-tours/?qp=lWOJw1XDa14WeujkN6zDTltGKtoYGc1S4a%2Bha5cOlrDDUWLLLinwRFzi6nlqMl%2BVOQZc7JhcT5%2BrCtZRd60mYbRBAbIrK%2Fvw0hu%2BN2LS3hnxmZJClGfzi2Tt7Kz%2FVgXt78L1KahlEhLXOAnyWBzUTMqS%2BH0ogTrvM92MX%2B4eoR3oFyJ9yLrQUF6d3bZ2Y25qf3Ureq4haZMpZo9b8XWEhbT0tldT0WTIEFY7EtXMa2gwfGnJA3x%2Faetv3ZE0nSsT0q0bhHufRgjsEgGWS1nRwVnVrhMWJ%2Fun%2B7R5TwJSomb7zQ54kf%2FGKZe6d4JNBxqeYmkeHvOnt7OgoBEenS9QXm3PF0eNVO8DBW2CXxOGL44%3D&p=1&w=0&s=0', '_blank')
    });
  }

  function disableAnswers(selectedButton) {
    answerButtons.forEach(button => button.style.pointerEvents = 'none');
    selectedButton.style.pointerEvents = 'auto'
  }

  function enableAnswers() {
    answerButtons.forEach(button => button.style.pointerEvents = 'auto');
  }
});
