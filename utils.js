export async function hostReactAppReady(
  selector = "#__next > div",
  timeout = 500,
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
 * Наблюдатель за элементами DOM по заданным селекторам.
 *
 * @class
 * @param {string|string[]} selectors - Один CSS-селектор или массив.
 * @param {Object} config - Конфигурация поведения наблюдателя.
 * @param {function(Element):void} [config.onAppear]
 * @param {function():void} [config.onDisappear]
 * @param {function(Element, MutationRecord[]):void} [config.onChildMutate]
 * @param {function(Element, MutationRecord[]):void} [config.onAttributeMutation]
 * @param {boolean} [config.watchChild=false]
 * @param {boolean} [config.watchAttributes=false]
 * @param {boolean} [config.once=false]
 * @param {boolean} [config.debug=false]
 * @param {boolean} [config.observeAttributes=false]
 * @param {boolean} [config.observeChildren=true]
 * @param {boolean} [config.observeCharacterData=false]
 * @param {string[]} [config.attributeFilter]
 */

export class ReactDomObserver {
  constructor(selectors, config = {}) {
    this.selectors = Array.isArray(selectors) ? selectors : [selectors];
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

    this.observedElements = new Map();
    this.triggeredOnce = new Set();
    this.elementObservers = new WeakMap();

    this.globalObserver = new MutationObserver(this._handleMutations);
  }

  start = () => {
    this._log('▶️ Start observing');
    this.globalObserver.observe(document.body, this.options);
    this._initialCheck();
  };

  stop = () => {
    this._log('⏹️ Stop observing');
    this.globalObserver.disconnect();
    this._disconnectInternalObservers();
  };

  updateSelectors = (newSelectors) => {
    this.selectors = Array.isArray(newSelectors) ? newSelectors : [newSelectors];
    this._initialCheck();
  };

  destroy = () => {
    this.stop();
    this.observedElements.clear();
    this.triggeredOnce.clear();
  };

  _initialCheck = () => {
    this.selectors.forEach(selector => {
      const el = document.querySelector(selector);
      if (el && !this.observedElements.get(selector)) {
        this._handleAppear(el, selector);
      }
    });
  };

  _handleMutations = () => {
    this.selectors.forEach(selector => {
      const el = document.querySelector(selector);
      const wasPresent = this.observedElements.get(selector) || false;

      if (el && !wasPresent) {
        this._handleAppear(el, selector);
      } else if (!el && wasPresent) {
        this._log(`⛔ Element disappeared: ${selector}`);
        this.observedElements.set(selector, false);
        this.onDisappear?.();
      }
    });
  };

  _handleAppear = (el, selector) => {
    this._log(`✅ Element appeared: ${selector}`);
    this.observedElements.set(selector, true);

    if (!this.once || !this.triggeredOnce.has(selector)) {
      this.onAppear?.(el);
      if (this.once) this.triggeredOnce.add(selector);
    }

    if (this.watchChild || this.watchAttributes) {
      this._observeElementInternally(el);
    }
  };

  _observeElementInternally = (el) => {
    if (this.elementObservers.has(el)) return;

    const observer = new MutationObserver(mutations => {
      const type = mutations[0]?.type;

      if (type === 'childList' && this.watchChild) {
        this.onChildMutate?.(el, mutations);
      } else if (type === 'attributes' && this.watchAttributes) {
        this.onAttributeMutation?.(el, mutations);
      }
    });

    observer.observe(el, {
      childList: this.watchChild,
      attributes: this.watchAttributes,
      subtree: false
    });

    this.elementObservers.set(el, observer);
    this._log('🔍 Internal observer set:', el);
  };

  _disconnectInternalObservers = () => {
    this.elementObservers.forEach(observer => observer.disconnect());
    this.elementObservers = new WeakMap();
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
