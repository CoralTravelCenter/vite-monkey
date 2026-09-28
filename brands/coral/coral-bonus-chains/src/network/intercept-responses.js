function resolveUrl(input, pageWindow) {
  const value = typeof pageWindow.Request !== 'undefined' && input instanceof pageWindow.Request
    ? input.url
    : String(input);

  try {
    return new URL(value, pageWindow.location.href).href;
  } catch {
    return value;
  }
}


function parseBody(text, contentType) {
  if (!text) {
    return null;
  }

  if (!contentType.toLowerCase().includes('json')) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}


function notifySafely(onResponse, response) {
  try {
    Promise.resolve(onResponse(response)).catch((error) => {
      console.error('[network-interceptor] Async response handler failed.', error);
    });
  } catch (error) {
    console.error('[network-interceptor] Response handler failed.', error);
  }
}


/**
 * Наблюдает за ответами fetch и XMLHttpRequest, не потребляя их оригинальные тела.
 * Возвращает функцию, которая восстанавливает исходные реализации браузерных API.
 */
export function interceptResponses({
  matches = () => true,
  onResponse,
  pageWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow,
}) {
  if (typeof onResponse !== 'function') {
    throw new TypeError('interceptResponses requires an onResponse callback.');
  }

  const originalFetch = pageWindow.fetch;
  const xhrPrototype = pageWindow.XMLHttpRequest.prototype;
  const originalXhrOpen = xhrPrototype.open;
  const originalXhrSend = xhrPrototype.send;
  const xhrRequests = new WeakMap();

  const interceptedFetch = async function (input, init) {
    const response = await originalFetch.apply(this, arguments);
    const request = {
      transport: 'fetch',
      url: resolveUrl(input, pageWindow),
      method: init?.method ?? (
        typeof pageWindow.Request !== 'undefined' && input instanceof pageWindow.Request
          ? input.method
          : 'GET'
      ),
    };

    if (matches(request)) {
      void response.clone().text()
        .then((text) => notifySafely(onResponse, {
          ...request,
          status: response.status,
          ok: response.ok,
          headers: response.headers,
          body: parseBody(text, response.headers.get('content-type') ?? ''),
        }))
        .catch((error) => console.error('[network-interceptor] Cannot read fetch response.', error));
    }

    return response;
  };

  const interceptedOpen = function (method, url) {
    xhrRequests.set(this, {
      transport: 'xhr',
      url: resolveUrl(url, pageWindow),
      method,
    });

    return originalXhrOpen.apply(this, arguments);
  };

  const interceptedSend = function () {
    const request = xhrRequests.get(this);

    if (request && matches(request)) {
      this.addEventListener('loadend', () => {
        let body = this.response;

        if (this.responseType === '' || this.responseType === 'text') {
          body = parseBody(this.responseText, this.getResponseHeader('content-type') ?? '');
        }

        notifySafely(onResponse, {
          ...request,
          status: this.status,
          ok: this.status >= 200 && this.status < 300,
          headers: this.getAllResponseHeaders(),
          body,
        });
      }, {once: true});
    }

    return originalXhrSend.apply(this, arguments);
  };

  pageWindow.fetch = interceptedFetch;
  xhrPrototype.open = interceptedOpen;
  xhrPrototype.send = interceptedSend;

  return () => {
    if (pageWindow.fetch === interceptedFetch) {
      pageWindow.fetch = originalFetch;
    }

    if (xhrPrototype.open === interceptedOpen) {
      xhrPrototype.open = originalXhrOpen;
    }

    if (xhrPrototype.send === interceptedSend) {
      xhrPrototype.send = originalXhrSend;
    }
  };
}
