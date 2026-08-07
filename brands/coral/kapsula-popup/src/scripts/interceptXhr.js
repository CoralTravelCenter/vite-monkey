import {filter, Subject} from 'rxjs';

const xhrEvents$ = new Subject();

let interceptorInstalled = false;

function installXhrInterceptor() {
  if (interceptorInstalled) {
    return;
  }

  interceptorInstalled = true;

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    method,
    url,
    ...args
  ) {
    this.__xhrInterceptorMeta = {
      method: String(method).toUpperCase(),
      url: String(url),
    };

    return originalOpen.call(
      this,
      method,
      url,
      ...args
    );
  };

  XMLHttpRequest.prototype.send = function (body) {
    const xhr = this;

    function handleLoadEnd() {
      xhr.removeEventListener(
        'loadend',
        handleLoadEnd
      );

      const meta =
        xhr.__xhrInterceptorMeta || {};

      let responseText = '';

      try {
        if (
          xhr.responseType === '' ||
          xhr.responseType === 'text'
        ) {
          responseText =
            xhr.responseText || '';
        }
      } catch (error) {
        responseText = '';
      }

      xhrEvents$.next({
        method: meta.method || '',
        requestUrl: meta.url || '',
        responseUrl:
          xhr.responseURL || '',
        status: xhr.status,
        ok:
          xhr.status >= 200 &&
          xhr.status < 300,
        response: xhr.response,
        responseText,
        xhr,
      });
    }

    xhr.addEventListener(
      'loadend',
      handleLoadEnd
    );

    return originalSend.call(this, body);
  };
}

function matchesEndpoint(url, endpoint) {
  if (typeof endpoint === 'function') {
    return endpoint(url);
  }

  if (endpoint instanceof RegExp) {
    endpoint.lastIndex = 0;
    return endpoint.test(url);
  }

  return url.includes(String(endpoint));
}

/**
 * Следит за завершением XHR-запросов.
 *
 * @param {string|RegExp|Function} endpoint
 * @param {number|null} expectedStatus
 * @returns {import('rxjs').Observable}
 */
export function interceptXhr(
  endpoint,
  expectedStatus = 200
) {
  installXhrInterceptor();

  return xhrEvents$.pipe(
    filter(({requestUrl, responseUrl}) => {
      return (
        matchesEndpoint(
          requestUrl,
          endpoint
        ) ||
        matchesEndpoint(
          responseUrl,
          endpoint
        )
      );
    }),

    filter(({status}) => {
      return (
        expectedStatus === null ||
        status === expectedStatus
      );
    })
  );
}
