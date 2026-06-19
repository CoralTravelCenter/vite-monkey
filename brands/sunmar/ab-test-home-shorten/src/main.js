import './style.css';

import {runCleanup} from './modules/cleanup.js';
import {initScrollGoalTracking, sendExperimentGoal} from './modules/analytics.js';
import {renderMiniPageBlocks} from './modules/blocks.js';
import {createCleanupObserver} from './modules/observer.js';

window.renderMiniPageBlocks = renderMiniPageBlocks;
document.addEventListener('miniPageBlockRegistered', renderMiniPageBlocks);

runCleanup();
initScrollGoalTracking();
sendExperimentGoal();
createCleanupObserver(runCleanup);
