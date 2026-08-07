import {
  auditTime,
  catchError,
  defer,
  distinctUntilChanged,
  from,
  map,
  merge,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import {AUTH_SELECTOR, LOGIN_ENDPOINT, LOGOUT_ENDPOINT} from './constants.js';
import {getCustomerName} from './getCustomerName.js';
import {interceptXhr} from './interceptXhr.js';

function isAuthorized() {
  return Boolean(document.querySelector(AUTH_SELECTOR));
}

function createDomAuthorization$() {
  return new Observable((subscriber) => {
    const emitAuthorization = () => {
      subscriber.next(isAuthorized());
    };

    emitAuthorization();

    const observer = new MutationObserver(emitAuthorization);

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }).pipe(
    auditTime(50),
    distinctUntilChanged()
  );
}

function createAuthorization$() {
  const loginSuccess$ = interceptXhr(LOGIN_ENDPOINT, 200).pipe(
    map(isAuthorized)
  );

  const logoutSuccess$ = interceptXhr(LOGOUT_ENDPOINT, 200).pipe(
    map(() => false)
  );

  return merge(
    createDomAuthorization$(),
    loginSuccess$,
    logoutSuccess$
  ).pipe(distinctUntilChanged());
}

export function createClientName$() {
  return createAuthorization$().pipe(
    switchMap((authorized) => {
      if (!authorized) {
        return of('');
      }

      return defer(() => from(getCustomerName(AUTH_SELECTOR))).pipe(
        map((name) => {
          if (!isAuthorized()) {
            return '';
          }

          return String(name || '').trim();
        }),
        catchError((error) => {
          console.error(
            '[Elite] Не удалось получить имя клиента:',
            error
          );

          return of('');
        })
      );
    }),
    distinctUntilChanged()
  );
}
