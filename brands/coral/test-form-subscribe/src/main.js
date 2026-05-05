import markup from './markup.html?raw';
import './style.css';
import {hostReactAppReady} from "../../utils.js";

(async () => {
  await hostReactAppReady()
  document.body.insertAdjacentHTML('afterbegin', markup)

  async function sendData(email) {
    const payload = {
      email: email,
      source: location.pathname
    }


    return await fetch('https://www.coral.ru/endpoints/Customer/AddSubscribtion', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  const FORM = document.getElementById('mindbox-once')
  FORM.addEventListener('submit', (e) => {
    e.preventDefault();
    sendData(e.target[0].value)
  })
})()
