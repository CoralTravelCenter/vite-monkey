import markup from './markup.html?raw';
import './style.css';
import { awaitDomElement } from '@utils';

const ROOT_ID = 'shambertest-root';

async function init() {
  if (document.getElementById(ROOT_ID)) {
    return;
  }

  const root = document.createElement('div');
  root.id = ROOT_ID;
  root.className = 'mindbox-experiment';
  root.innerHTML = markup;

  try {
    // Ждем ту самую полосочку (колонку) со скриншота
    const targetElement = await awaitDomElement('#section-column-1');

    if (targetElement) {
      // append вставляет твой root ВНУТРЬ найденного div-а
      targetElement.append(root);
      console.log('✅ Блок успешно вставлен в #section-column-1');
    }
  } catch (error) {
    console.error('❌ Ошибка при ожидании элемента:', error);
  }
}

init();