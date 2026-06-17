import './style.css';

import {runCleanup, runStaticCleanup} from './modules/cleanup.js';
import {initScrollGoalTracking, sendExperimentGoal} from './modules/analytics.js';
import {loadGlide} from './modules/slider.js';
import {renderMiniPageBlocks} from './modules/blocks.js';
import {createCleanupObserver, hasFirstOriginalSlide} from './modules/observer.js';

window.renderMiniPageBlocks = renderMiniPageBlocks;
document.addEventListener('miniPageBlockRegistered', renderMiniPageBlocks);

runStaticCleanup();

loadGlide()
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    initScrollGoalTracking();
    sendExperimentGoal();
    createCleanupObserver(runCleanup);

    if (hasFirstOriginalSlide()) {
      runCleanup();
    }
  });
