/**
 * trimSlidesData
 * ============================================================
 * АЛЬТЕРНАТИВНЫЙ ПОДХОД к сокращению слайдов карусели.
 *
 * Чем отличается от ohotnikNaKarusel.js:
 *
 *   ohotnikNaKarusel.js правит УЖЕ ОТРИСОВАННЫЙ DOM: ловит
 *   системный Glide, делает destroy(), удаляет слайды,
 *   монтирует обратно. Из-за этого ломаются клоны, автоплей
 *   и зацикливание, а React может вернуть слайды назад.
 *
 *   Здесь мы вмешиваемся НА ШАГ РАНЬШЕ — в данные, из которых
 *   Next.js рисует карусель. Убираем лишние элементы из
 *   массива до гидратации, и дальше всё происходит штатно:
 *   React рисует нужное количество слайдов, Glide монтируется
 *   на правильном наборе, обвязка сайта сама заводит автоплей
 *   и зацикливание. Никаких destroy()/mount() не требуется.
 *
 * ГЛАВНОЕ ОГРАНИЧЕНИЕ.
 * Работает, только если скрипт успевает выполниться ДО
 * гидратации React. Если Mindbox вставит код позже — React
 * уже отрисует карусель по исходным данным, и правка ничего
 * не изменит. Это проверяется на боевой странице (см. лог
 * `Hydration already happened`).
 *
 * Отладка: localStorage.coralGlideDebug = '1'
 * ============================================================
 */

const DEBUG =
  typeof localStorage !== 'undefined' &&
  localStorage.getItem('coralGlideDebug') === '1';

function log(...args) {
  if (DEBUG) {
    console.log('[TrimSlides]', ...args);
  }
}

function logError(...args) {
  if (DEBUG) {
    console.error('[TrimSlides]', ...args);
  }
}

/*
 * Путь до массива слайдов внутри __NEXT_DATA__.
 *
 * Найден разведкой на боевой странице. Числа — это индексы
 * массивов, поэтому путь разбирается универсально (см.
 * resolvePath): 'schema.0.schema.0' работает и для объектов,
 * и для массивов.
 *
 * Путь вынесен в константу, потому что он завязан на
 * структуру данных сайта и может измениться при доработках
 * на их стороне.
 */
const SLIDES_PATH =
  'props.pageProps.pageData.layout.schema.0.schema.0' +
  '.widget.0.widgetData.menus.3.menus';

/**
 * Достаёт значение по строковому пути вида 'a.b.0.c'.
 *
 * Возвращает undefined, если путь оборвался — так мы не
 * упадём, если сайт поменяет структуру данных.
 *
 * @param {object} root
 * @param {string} path
 */
function resolvePath(root, path) {
  return path.split('.').reduce((current, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }

    return current[key];
  }, root);
}

/**
 * Достаёт родителя и последний ключ, чтобы можно было
 * присвоить новое значение по пути.
 *
 * @param {object} root
 * @param {string} path
 * @returns {{parent: object, key: string}|null}
 */
function resolveParent(root, path) {
  const keys = path.split('.');
  const key = keys.pop();
  const parent = resolvePath(root, keys.join('.'));

  if (!parent || typeof parent !== 'object') {
    return null;
  }

  return { parent, key };
}

/**
 * Читает и парсит __NEXT_DATA__.
 *
 * Работаем именно с DOM-элементом, а не с window.__NEXT_DATA__:
 * до гидратации объект в window может ещё не существовать,
 * а тег в разметке уже есть.
 */
function readNextData() {
  const element = document.getElementById('__NEXT_DATA__');

  if (!element) {
    logError('__NEXT_DATA__ not found');
    return null;
  }

  try {
    return JSON.parse(element.textContent);
  } catch (error) {
    logError('Failed to parse __NEXT_DATA__', error);
    return null;
  }
}

/**
 * Проверяет, не поздно ли править данные.
 *
 * Если карусель уже в DOM, значит React отрисовал её по
 * исходным данным и наша правка не даст эффекта.
 *
 * @returns {boolean} true — гидратация уже прошла
 */
function isHydrated() {
  return Boolean(document.querySelector('.glide__slide'));
}

/**
 * Сокращает массив слайдов в данных Next.js.
 *
 * Правим объект в window.__NEXT_DATA__: именно его читает
 * React при гидратации. Текстовое содержимое script-тега
 * обновляем следом — на случай, если объект будет
 * перечитан из разметки.
 *
 * @param {(items: any[]) => any[]} sliceFn
 *  Функция, возвращающая слайды, которые надо ОСТАВИТЬ.
 * @returns {boolean} удалось ли применить правку
 */
export function trimSlides(sliceFn) {
  if (isHydrated()) {
    logError(
      'Hydration already happened — правка данных не поможет, ' +
      'карусель уже отрисована. Нужен другой подход ' +
      '(правка DOM) либо более ранняя вставка скрипта.',
    );

    return false;
  }

  const element = document.getElementById('__NEXT_DATA__');
  const data = window.__NEXT_DATA__ ?? readNextData();

  if (!data) {
    return false;
  }

  const target = resolveParent(data, SLIDES_PATH);

  if (!target) {
    logError(`Путь не разрешился: ${SLIDES_PATH}`);
    return false;
  }

  const slides = target.parent[target.key];

  if (!Array.isArray(slides)) {
    logError('По указанному пути лежит не массив:', slides);
    return false;
  }

  const next = sliceFn(slides);

  target.parent[target.key] = next;

  log('Slides trimmed', {
    was: slides.length,
    now: next.length,
  });

  /*
   * Синхронизируем разметку с объектом.
   * JSON.stringify экранируем, чтобы закрывающий тег внутри
   * данных не разорвал script.
   */
  if (element) {
    try {
      element.textContent = JSON.stringify(data).replace(
        /<\/script/gi,
        '<\\/script',
      );
    } catch (error) {
      logError('Failed to write __NEXT_DATA__ back', error);
    }
  }

  return true;
}

/**
 * Удаляет первые `count` слайдов из данных.
 * Аналог removeFirst() из ohotnikNaKarusel.js.
 *
 * @param {number} [count]
 */
export function removeFirstSlides(count = 3) {
  return trimSlides((items) => items.slice(count));
}

/**
 * Оставляет только первые `count` слайдов.
 * Аналог keepFirst() из ohotnikNaKarusel.js.
 *
 * @param {number} [count]
 */
export function keepFirstSlides(count = 3) {
  return trimSlides((items) => items.slice(0, count));
}
