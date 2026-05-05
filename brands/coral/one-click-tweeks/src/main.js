import './style.scss';
import {hostReactAppReady} from "../../utils.js";
import scriptInner from '../src/scriptInner.html?raw';

(async () => {
  await hostReactAppReady()

  const script = document.createElement('script');
  script.setAttribute('data-b24-form', 'inline/414/m4q4ey');
  script.setAttribute('data-skip-moving', 'true');
  script.innerHTML = scriptInner;
  document.body.appendChild(script);


  // await hostReactAppReady('.b24-form-click-btn')
  // const button = document?.querySelector(".b24-form-click-btn");
  // button.addEventListener("click", () => {
  //   ym(96674199, "reachGoal", "fill", {
  //     page: location.pathname
  //   });
  // });
})()
