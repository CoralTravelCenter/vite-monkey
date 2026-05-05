import './style.css';
import {ReactDomObserver} from "../../../utils.js";

function observeTextChanges(element, callback) {
  if (!element) return;

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'characterData' && mutation.target === element.firstChild) {
        callback(element.textContent);
      }
    });
  });

  observer.observe(element, {
    characterData: true,
    subtree: true,
    childList: false
  });

  return () => observer.disconnect();
}

const TargetMonth = ['Апрель', 'Июль', 'Август', 'Сентябрь']
new ReactDomObserver('.ant-picker-header', {
  onAppear: () => {
    const TargetButtons = document?.querySelectorAll('.ant-picker-month-btn');
    TargetButtons && TargetButtons.forEach(button => {
      observeTextChanges(button, (newText) => {
        const isCorrectYear = button.nextElementSibling.textContent === '2026'
        const isCorrectText = TargetMonth.some(month => month === newText)

        if (!isCorrectYear) {
          button.removeAttribute('data-promo')
          return;
        }

        if (isCorrectText) {
          button.setAttribute('data-promo', 'kalendar')
        } else {
          button.removeAttribute('data-promo')
        }
      });
    })
  }
}).start();
