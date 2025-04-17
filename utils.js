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


export function mediaMatcher(size, callback) {
  const mobileWidthMediaQuery = window.matchMedia(`(max-width: ${size}px)`);
  callback(mobileWidthMediaQuery.matches);
  mobileWidthMediaQuery.addEventListener("change", (e) =>
    callback(e.matches),
  );
}

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export function getMobileOS() {
  const userAgent = navigator.userAgent
  switch (true) {
    case /android/i.test(userAgent):
      return "android";
    case /iPad|iPhone|iPod/.test(userAgent):
      return "ios";
    default:
      return "other";
  }
}

export function copyToClipboard(text) {
  try {
    navigator.clipboard.writeText(text);
  } catch {
    throw new Error(message);
  }
}

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


/**
 * Наблюдатель за появлением, исчезновением и мутациями конкретного DOM-элемента.
 */
export class ReactDomObserver {
  /**
   * @param {string} selector - CSS-селектор DOM-элемента для отслеживания.
   * @param {Object} [config={}] - Объект конфигурации.
   * @param {boolean} [config.once=false] - Вызвать `onAppear` только один раз.
   * @param {boolean} [config.debug=false] - Включить логирование.
   * @param {boolean} [config.watchChild=false] - Следить за изменениями потомков.
   * @param {boolean} [config.watchAttributes=false] - Следить за изменениями атрибутов.
   * @param {boolean} [config.observeAttributes=false] - Включить слежку за атрибутами на корне.
   * @param {boolean} [config.observeChildren=true] - Включить слежку за дочерними элементами (по умолчанию включено).
   * @param {boolean} [config.observeCharacterData=false] - Включить наблюдение за текстовыми узлами.
   * @param {string[]} [config.attributeFilter] - Фильтр по названиям атрибутов.
   * @param {(el: HTMLElement) => void} [config.onAppear] - Колбэк при появлении элемента.
   * @param {() => void} [config.onDisappear] - Колбэк при исчезновении элемента.
   * @param {(el: HTMLElement, mutations: MutationRecord[]) => void} [config.onChildMutate] - Колбэк при изменении дочерних узлов.
   * @param {(el: HTMLElement, mutations: MutationRecord[]) => void} [config.onAttributeMutation] - Колбэк при изменении атрибутов.
   */
  constructor(selector, config = {}) {
    this.selector = selector;
    this.once = !!config.once;
    this.debug = !!config.debug;

    this.watchChild = !!config.watchChild;
    this.watchAttributes = !!config.watchAttributes;

    this.onAppear = config.onAppear ?? null;
    this.onDisappear = config.onDisappear ?? null;
    this.onChildMutate = config.onChildMutate ?? null;
    this.onAttributeMutation = config.onAttributeMutation ?? null;

    this.options = {
      attributes: !!config.observeAttributes,
      childList: config.observeChildren !== false,
      characterData: !!config.observeCharacterData,
      subtree: true,
      attributeFilter: Array.isArray(config.attributeFilter) ? config.attributeFilter : undefined
    };

    this.observed = false;
    this.triggeredOnce = false;
    this.elementObserver = null;

    this.globalObserver = new MutationObserver(this._handleMutations);
  }

  /**
   * Запускает наблюдение за элементом.
   */
  start = () => {
    this._log('▶️ Start observing');
    this.globalObserver.observe(document.body, this.options);
    requestAnimationFrame(this._initialCheck);
  };

  /**
   * Останавливает наблюдение и отключает все наблюдатели.
   */
  stop = () => {
    this._log('⏹️ Stop observing');
    this.globalObserver.disconnect();
    this._disconnectInternalObserver();
  };

  _initialCheck = () => {
    const el = document.querySelector(this.selector);
    if (el && !this.observed) {
      this._handleAppear(el);
    }
  };

  _handleMutations = () => {
    const el = document.querySelector(this.selector);
    const wasPresent = this.observed;

    if (el && !wasPresent) {
      this._handleAppear(el);
    } else if (!el && wasPresent) {
      this._log(`⛔ Element disappeared: ${this.selector}`);
      this.observed = false;
      this.onDisappear?.();
    }
  };

  /**
   * Обрабатывает появление элемента.
   * @param {HTMLElement} el
   * @private
   */
  _handleAppear = (el) => {
    this._log(`✅ Element appeared: ${this.selector}`);
    this.observed = true;

    if (!this.once || !this.triggeredOnce) {
      this.onAppear?.(el);
      if (this.once) this.triggeredOnce = true;
    }

    if (this.watchChild || this.watchAttributes) {
      this._observeElementInternally(el);
    }
  };

  /**
   * Включает внутреннего наблюдателя на конкретный DOM-элемент.
   * @param {HTMLElement} el
   * @private
   */
  _observeElementInternally = (el) => {
    if (this.elementObserver) return;

    this.elementObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && this.watchChild) {
          this.onChildMutate?.(el, mutations);
          break;
        }
        if (mutation.type === 'attributes' && this.watchAttributes) {
          this.onAttributeMutation?.(el, mutations);
          break;
        }
      }
    });

    this.elementObserver.observe(el, {
      childList: this.watchChild,
      attributes: this.watchAttributes,
      subtree: false
    });

    this._log('🔍 Internal observer set:', el);
  };

  /**
   * Отключает внутреннего наблюдателя.
   * @private
   */
  _disconnectInternalObserver = () => {
    if (this.elementObserver) {
      this.elementObserver.disconnect();
      this.elementObserver = null;
    }
  };

  /**
   * Логирование при включённом debug.
   * @param {...any} args
   * @private
   */
  _log = (...args) => {
    if (this.debug) console.log('[DOMObserver]', ...args);
  };
}


export function appendOnce(placeToAppend, element) {
  if (placeToAppend.hasAttribute('data-inserted')) return;
  placeToAppend.append(element)
  placeToAppend.setAttribute('data-inserted', 'true')
}
