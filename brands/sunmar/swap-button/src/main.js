import { initInjector } from './scripts/initInjector.js';
import { initSwapAnimation } from './scripts/initSwapAnimations.js';
import './style.css';

await hostReactAppReady();

initInjector();
initSwapAnimation();