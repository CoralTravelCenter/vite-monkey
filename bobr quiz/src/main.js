import './style.css';
import './quiz-widget.js';
import {aprilQuizData} from "./data.js";

document.body.insertAdjacentHTML(
    'beforeend',
    `
    <button id="quiz-start">${aprilQuizData.launcher.label}</button>
    <sunmar-popup id="quiz-popup">
      <quiz-widget id="travel-quiz"></quiz-widget>
    </sunmar-popup>
  `
);

const quiz = document.getElementById('travel-quiz');
const start = document.getElementById('quiz-start');
const popup = document.getElementById('quiz-popup');

quiz.data = aprilQuizData;

start.addEventListener('click', () => {
    popup.show();
});


