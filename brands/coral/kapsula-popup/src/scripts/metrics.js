import {COUNTER_ID} from './constants.js';

function sendMetric(goal, params) {
  if (typeof window.ym !== 'function') {
    return;
  }

  window.ym(
    COUNTER_ID,
    'reachGoal',
    goal,
    params
  );
}

export function sendCapsulaClickMetric(buttonName) {
  sendMetric(
    'capsula_elite_pop_up_click',
    {
      button_name: buttonName,
    }
  );
}

export function sendPopupOpenMetric() {
  sendMetric(
    'capsula_elite_pop_up_click_to_show'
  );
}

export function sendLearnMoreMetric() {
  sendMetric(
    'entry-point',
    {
      name_stock: {
        capsula: {
          name_point: 'pop_up_elite',
        },
      },
    }
  );

  sendCapsulaClickMetric('learn_more');
}
