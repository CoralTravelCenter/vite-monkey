export function setLocalStorageWithExpiry(key, value, expiryInDays) {
  const expiryTime = Date.now() + expiryInDays * 86400000; // 24*60*60*1000
  const item = {value, expiry: expiryTime};
  localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageWithExpiry(key) {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const {value, expiry} = JSON.parse(itemStr);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  } catch (e) {
    console.error(`Ошибка при чтении ключа "${key}" из localStorage:`, e);
    localStorage.removeItem(key);
    return null;
  }
}


export async function hostReactAppReady(
  selector = "#__next > div",
  timeout = 200,
) {
  return new Promise((resolve) => {
    const waiter = () => {
      const host_el = document.querySelector(selector);
      if (host_el?.getBoundingClientRect().height) {
        resolve();
      } else {
        setTimeout(waiter, timeout);
      }
    };
    waiter();
  });
}

export async function waiteSelector(
  selector,
  timeout = 200,
) {
  return new Promise((resolve) => {
    const waiter = () => {
      const host_el = document.querySelector(selector);
      if (host_el) {
        resolve();
      } else {
        setTimeout(waiter, timeout);
      }
    };
    waiter();
  });
}

export async function waitForLibrary(getterFn, timeout = 200) {
  return new Promise((resolve) => {
    const waiter = () => {
      const result = getterFn();
      if (result) {
        resolve(result);
      } else {
        setTimeout(waiter, timeout);
      }
    };
    waiter();
  });
}

export function getMobileOS() {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) return 'android';
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
  return 'other';
}

export function getBrand() {
  if (location.host.includes('sunmar')) return 'sunmar';
  if (location.host.includes('coral')) return 'coral';
  return null;
}


export function mediaMatcher(size, callback) {
  const mobileWidthMediaQuery = window.matchMedia(`(max-width: ${size}px)`);
  callback(mobileWidthMediaQuery.matches);
  mobileWidthMediaQuery.addEventListener("change", (e) =>
    callback(e.matches),
  );
}

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

//export function getMobileOS() {
//  const userAgent = navigator.userAgent
//  switch (true) {
//    case /android/i.test(userAgent):
//      return "android";
//    case /iPad|iPhone|iPod/.test(userAgent):
//      return "ios";
//    default:
//      return "other";
//  }
//}

// export function copyToClipboard(text) {
//   try {
//     navigator.clipboard.writeText(text);
//   } catch {
//     throw new Error(message);
//   }
// }

export function setYMTarget(selector, target_id, target) {
  selector.addEventListener("click", () => {
    ym(target_id, "reachGoal", target);
  });
}

export async function preloadScript(url, cb) {
  return new Promise(resolve => {
    const script_el = document.createElement('script');
    script_el.addEventListener('load', () => {
      script_el.remove();
      typeof cb === 'function' && cb();
      resolve();
    });
    script_el.src = url;
    document.head.append(script_el);
  });
}


export async function vimeoAutoPlay(observer_options = {}) {
  const vboxes = document.querySelectorAll('.vimeo-video-box [data-vimeo-vid]');
  if (vboxes.length) {
    await preloadScript('https://player.vimeo.com/api/player.js');
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const target = entry.target;
        if (entry.isIntersecting) {
          if (!target['vimeo-player']) {
            target['vimeo-player'] = new Vimeo.Player(target, {
              id: target.dataset.vimeoVid,
              background: 1,
              playsinline: 1,
              autopause: 0,
              title: 0,
              byline: 0,
              portrait: 0,
              autoplay: 1,
              muted: 1,
            });
            target['vimeo-player'].on('play', function () {
              this.element.parentElement.classList.add('playback');
            });
          }
          target['vimeo-player'].play();
        } else {
          target['vimeo-player']?.pause();
        }
      });
    }, Object.assign({}, {threshold: .33}, observer_options));
    vboxes.forEach(box => io.observe(box));
  }
}


export async function asap(cb) {
  if (['complete', 'interactive'].includes(document.readyState)) {
    cb && cb();
    return Promise.resolve();
  }
  return new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', () => {
      cb && cb();
      resolve();
    });
  });
}

export function queryParam(p, source) {
  source ||= location.href;
  let [url, query] = source.split('?');
  query ||= '';
  const params_kv = query.split('&');
  const params = {};
  for (const kv of params_kv) {
    let [k, v] = kv.split('=');
    try {
      v = decodeURIComponent(v);
      v = JSON.parse(v);
    } catch (ex) {
    }
    params[k] = v;
  }
  if (p) {
    return params[p];
  } else {
    return params;
  }
}

export function endpointUrl(endpoint) {
  const isLocalhost = location.hostname === "localhost";
  const host = isLocalhost
    ? "http://localhost:8010/proxy"
    : "//" + location.hostname.replace(/^(www|new)/, "b2capi");
  return `${host}${endpoint}`;
}

export function params2query(p) {
  const kv = [];
  for (let [k, v] of Object.entries(p)) {
    kv.push(`${k}=${encodeURIComponent(typeof v === 'object' ? JSON.stringify(v) : v)}`);
  }
  return kv.join('&');
}

export function getNextData() {
  const config_el = document.getElementById('__NEXT_DATA__');
  return config_el ? JSON.parse(config_el.textContent) : window.__NEXT_DATA__;
}

export function arrayOfNodesWith(what) {
  var nodes;
  if (what.jquery) {
    nodes = what.toArray();
  } else if (what instanceof Array) {
    nodes = what.map(item => arrayOfNodesWith(item)).flat(Infinity);
  } else if (what instanceof Node) {
    nodes = [what];
  } else if (what instanceof NodeList || what instanceof HTMLCollection) {
    nodes = Array.from(what);
  } else if (typeof what === 'string') {
    nodes = Array.from(document.querySelectorAll(what));
  } else {
    throw "*** arrayOfNodesWith: Got something unusable as 'what' param: " + what;
  }
  return nodes;
}

export function watchIntersection(targets, options, yes_handler, no_handler) {
  const io = new IntersectionObserver(function (entries, observer) {
    for (const entry of entries) {
      entry.isIntersecting ? yes_handler?.call(this, entry.target, observer) : no_handler?.call(this, entry.target, observer);
    }
  }, {
    threshold: 1,
    ...options
  });
  for (const node of arrayOfNodesWith(targets)) {
    io.observe(node);
  }
  return io;
}


export class ReactDomObserver {
  /**
   * @param {string} selector
   * @param {Object} [config={}]
   * @param {boolean} [config.once=false]
   * @param {boolean} [config.debug=false]
   * @param {boolean} [config.watchChild=false]
   * @param {boolean} [config.watchAttributes=false]
   * @param {boolean} [config.watchCharacterData=false]
   * @param {string[]} [config.attributeFilter]
   * @param {(el: HTMLElement) => void} [config.onAppear]
   * @param {() => void} [config.onDisappear]
   * @param {(el: HTMLElement, mutations: MutationRecord[], count: number) => void} [config.onChildMutate]
   * @param {(el: HTMLElement, mutations: MutationRecord[], count: number) => void} [config.onAttributeMutation]
   * @param {(el: HTMLElement, mutations: MutationRecord[], count: number) => void} [config.onCharacterData]
   */
  constructor(selector, config = {}) {
    this.selector = selector;
    this.once = !!config.once;
    this.debug = !!config.debug;

    this.watchChild = !!config.watchChild;
    this.watchAttributes = !!config.watchAttributes;
    this.watchCharacterData = !!config.watchCharacterData;

    this.onAppear = config.onAppear ?? null;
    this.onDisappear = config.onDisappear ?? null;
    this.onChildMutate = config.onChildMutate ?? null;
    this.onAttributeMutation = config.onAttributeMutation ?? null;
    this.onCharacterData = config.onCharacterData ?? null;

    this.options = {
      attributes: this.watchAttributes,
      childList: this.watchChild,
      characterData: this.watchCharacterData,
      subtree: true,
      attributeFilter: Array.isArray(config.attributeFilter) ? config.attributeFilter : undefined,
    };

    // флаги/состояния
    this.started = false;
    this.observed = false;       // есть ли элемент сейчас в DOM
    this.triggeredOnce = false;  // onAppear уже вызывали при once=true
    this.mutationCounter = 0;

    // observer’ы
    this.elementObserver = null;
    this.globalObserver = new MutationObserver(this._handleMutations);
    this._rafId = 0;

    // защита от повторной обработки конкретных элементов
    this.seenElements = new WeakSet();
  }

  start = () => {
    if (this.started) return;
    this.started = true;

    this._log('▶️ Start observing');
    this.globalObserver.observe(document.body, {childList: true, subtree: true});
    requestAnimationFrame(this._initialCheck);
  };

  stop = () => {
    if (!this.started) return;
    this._log('⏹️ Stop observing');

    this.started = false;
    this.globalObserver.disconnect();
    this._disconnectInternalObserver();

    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }
  };

  _initialCheck = () => {
    // ищем сразу все совпадения, а не только первый
    const nodes = document.querySelectorAll(this.selector);
    if (nodes.length) {
      nodes.forEach(el => this._maybeAppear(el));
    } else if (this.observed) {
      // если раньше был, но пропал
      this._handleDisappear();
    }
  };

  // дебаунс глобальных мутаций (схлопываем в один проход на кадр)
  _handleMutations = () => {
    if (this._rafId) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = 0;
      // проверяем наличие элементов селектора
      const nodes = document.querySelectorAll(this.selector);
      const hasAny = nodes.length > 0;

      if (hasAny) {
        nodes.forEach(el => this._maybeAppear(el));
      } else if (this.observed) {
        this._handleDisappear();
      }
    });
  };

  _maybeAppear = (el) => {
    // уже обрабатывали этот конкретный элемент — пропускаем
    if (this.seenElements.has(el)) return;

    this.seenElements.add(el);

    // помечаем, что в DOM есть хотя бы один целевой элемент
    if (!this.observed) {
      this.observed = true;
    }

    this._handleAppear(el);
  };

  _handleDisappear = () => {
    this._log(`⛔ Element(s) disappeared: ${this.selector}`);
    this.observed = false;
    this.onDisappear?.();
  };

  _handleAppear = (el) => {
    this._log(`✅ Element appeared: ${this.selector}`, el);

    if (!this.once || !this.triggeredOnce) {
      this.onAppear?.(el);
      if (this.once) this.triggeredOnce = true;
    }

    if (this.once && this.triggeredOnce) {
      // если нужен ровно один вызов – можно выключиться
      this.stop();
      return;
    }

    if (this.watchChild || this.watchAttributes || this.watchCharacterData) {
      this._observeElementInternally(el);
    }
  };

  _observeElementInternally = (el) => {
    if (this.elementObserver) return;

    this.elementObserver = new MutationObserver((mutations) => {
      // временно отключаем, чтобы не ловить собственные эффекты
      this._disconnectInternalObserver();

      try {
        this.mutationCounter++;

        // Группируем по типам и вызываем соответствующие колбэки один раз на пачку
        const hasChild = this.watchChild && mutations.some(m => m.type === 'childList');
        const hasAttr = this.watchAttributes && mutations.some(m => m.type === 'attributes');
        const hasChar = this.watchCharacterData && mutations.some(m => m.type === 'characterData');

        if (hasChild) {
          this._log(`👶 Child mutation #${this.mutationCounter}`);
          this.onChildMutate?.(el, mutations, this.mutationCounter);
        }
        if (hasAttr) {
          this._log(`🧬 Attribute mutation #${this.mutationCounter}`);
          this.onAttributeMutation?.(el, mutations, this.mutationCounter);
        }
        if (hasChar) {
          this._log(`✏️ Character data #${this.mutationCounter}`);
          this.onCharacterData?.(el, mutations, this.mutationCounter);
        }
      } finally {
        // пере-подписываемся
        if (this.started) this._observeElementInternally(el);
      }
    });

    this.elementObserver.observe(el, this.options);
    this._log('🔍 Internal observer set:', el);
  };

  _disconnectInternalObserver = () => {
    if (this.elementObserver) {
      this.elementObserver.disconnect();
      this.elementObserver = null;
    }
  };

  _log = (...args) => {
    if (this.debug) console.log('[DOMObserver]', ...args);
  };
}


export function appendOnce(placeToAppend, element) {
  if (placeToAppend.hasAttribute('data-inserted')) return;
  placeToAppend.append(element)
  placeToAppend.setAttribute('data-inserted', 'true')
}

export function insertOnce(target, position, html, randomId) {
  const BODY = document.body;
  if (!BODY.querySelector(`[data-inserted="${randomId}"]`)) {
    target.insertAdjacentHTML(position, html);
    BODY.setAttribute('data-inserted', randomId);
  }
}

export async function doRequestToServer(endpoint, data, method = "POST") {
  try {
    const url = endpointUrl(endpoint);
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText} for ${endpoint}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in doRequestToServer for endpoint ${endpoint}:`, error);
    throw error;
  }
}

export function filterUniqueMatchingHotels(responses, requestedNames) {
  if (!responses.length || !requestedNames.length) {
    return [];
  }

  const requestedSet = new Set(
    requestedNames.map(name => name.trim().toUpperCase()).filter(Boolean)
  );

  const uniqueMap = new Map();

  responses.forEach(response => {
    response.result?.locations?.forEach(location => {
      const normalizedName = location.name.trim().toUpperCase();
      if (requestedSet.has(normalizedName) && !uniqueMap.has(location.id)) {
        uniqueMap.set(location.id, location);
      }
    });
  });

  return Array.from(uniqueMap.values());
}

export function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall

    this.lastCall = Date.now()

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer)
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
  }
}


export function insertAfter(newNode, referenceNode) {
  referenceNode.replaceWith(newNode);
}


export function sendYandexEventOnce(eventName, ttlHours = 2, cb) {
  const key = `ym_event_${eventName}`;
  const now = Date.now();
  const ttl = ttlHours * 60 * 60 * 1000;
  const stored = JSON.parse(localStorage.getItem(key) || '{}');
  const age = now - (stored.timestamp || 0);

  if (age < ttl) return; // TTL не истёк — ничего не делаем

  cb(); // вызываем переданную функцию
  localStorage.setItem(key, JSON.stringify({timestamp: now}));
}


export class CoralCookieObserver {
  constructor(key, options = {}) {
    if (typeof key !== 'string' || !key) {
      throw new Error('CoralCookieObserver: cookie key must be a non-empty string.');
    }

    this.key = key;
    this.delay = options.delay || 1000;
    this.lastValue = this.getCookieValue();
    this.callbacks = [];
    this.timer = null;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.check(), this.delay);
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  onChange(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  check() {
    const currentValue = this.getCookieValue();
    if (currentValue !== this.lastValue) {
      this.callbacks.forEach(cb => cb(currentValue, this.lastValue));
      this.lastValue = currentValue;
    }
  }

  getCookieValue() {
    const cookies = document.cookie.split(';');
    for (const c of cookies) {
      const [k, ...v] = c.trim().split('=');
      if (k === this.key) {
        return decodeURIComponent(v.join('='));
      }
    }
    return undefined;
  }
}

export function generateRandomId(length = 12) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
}

export function runOncePerSession(key = "codeExecuted") {
  if (sessionStorage.getItem(key)) {
    return false; // уже запускали в этой сессии
  }
  sessionStorage.setItem(key, "true");
  return true; // первый запуск
}

export class ClickOutside {
  /**
   * @param {string} selector                   - селектор элемента
   * @param {(evt: Event) => void} callback     - вызывается при клике вне
   * @param {Object} [options]
   * @param {(HTMLElement|string|((evt: Event)=>boolean))[]} [options.ignore=[]]
   * @param {boolean} [options.capture=true]
   * @param {boolean} [options.once=false]
   */
  constructor(selector, callback, {ignore = [], capture = true, once = false} = {}) {
    if (typeof selector !== 'string') {
      throw new TypeError('ClickOutside: "selector" должен быть строкой');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('ClickOutside: "callback" должен быть функцией');
    }

    this.selector = selector;
    this.element = document.querySelector(selector) || null;
    this.callback = callback;
    this.ignore = ignore;
    this.capture = capture;
    this.once = once;

    this._handler = this._handler.bind(this);
    document.addEventListener('click', this._handler, this.capture);
    this._listening = true;
  }

  /** Обновить селектор (например, если элемент заменили) */
  setSelector(selector) {
    this.selector = selector;
    this.element = document.querySelector(selector) || null;
  }

  /** Снять слушатель */
  destroy() {
    if (!this._listening) return;
    document.removeEventListener('click', this._handler, this.capture);
    this._listening = false;
  }

  _handler(evt) {
    if (!this.element) {
      this.element = document.querySelector(this.selector) || null;
      if (!this.element) return; // элемента ещё нет в DOM
    }

    if (!this._isOutside(evt)) return;

    this.callback(evt);
    if (this.once) this.destroy();
  }

  _isOutside(evt) {
    const el = this.element;
    if (!el) return false;

    const path = typeof evt.composedPath === 'function' ? evt.composedPath() : this._buildPath(evt);
    if (path.includes(el) || el.contains(evt.target)) return false;

    for (const ig of this.ignore) {
      if (typeof ig === 'function' && ig(evt)) return false;
      if (typeof ig === 'string' && evt.target?.closest?.(ig)) return false;
      if (ig instanceof HTMLElement && (path.includes(ig) || ig.contains(evt.target))) return false;
    }
    return true;
  }

  _buildPath(evt) {
    const path = [];
    let node = evt.target;
    while (node) {
      path.push(node);
      node = node.parentNode || node.host || null;
    }
    path.push(window);
    return path;
  }
}
