import {reactDomObserver} from '../../../../utils/index.js';

import markup from './markup.html?raw';
import popupMarkup from './popup.html?raw';
import './style.scss';

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

import {interceptXhr} from './interceptXhr.js';
import {getCustomerName} from './getCustomerName.js';

const HEADER_SELECTOR =
  '[class*="HeaderTopBar_iconContainer__"]';

const AUTH_SELECTOR =
  '.user-profile-dropdown-button';

const PERSONALIZED_CONTENT_SELECTOR =
  '[data-personalized-content]';

const POPUP_TRIGGER_SELECTOR =
  '#coral-popup-trigger';

const POPUP_SELECTOR =
  '#kapsula-popup-home';

const LOGIN_ENDPOINT =
  '/endpoints/Customer/Login';

const LOGOUT_ENDPOINT =
  '/api/auth/logout';

function sendCapsulaClickMetric(buttonName) {
  if (typeof window.ym !== 'function') {
    return;
  }

  window.ym(
    96674199,
    'reachGoal',
    'capsula_elite_pop_up_click',
    {
      button_name: buttonName,
    }
  );
}

function bindShadowCloseMetric(popup) {
  const shadowRoot = popup?.shadowRoot;

  if (!shadowRoot) {
    console.warn(
      '[Elite] Shadow DOM popup недоступен'
    );
    return;
  }

  const closeSelector =
    '[part~="close-button"], ' +
    '[part~="popup-close"], ' +
    '[part~="close"], ' +
    'button[aria-label="Закрыть"], ' +
    'button[aria-label="Close"], ' +
    '[data-close], ' +
    '.close';

  const closeButton = shadowRoot.querySelector(
    closeSelector
  );

  if (!closeButton) {
    console.warn(
      '[Elite] Кнопка закрытия popup не найдена'
    );
    return;
  }

  closeButton.addEventListener(
    'click',
    () => {
      sendCapsulaClickMetric('close');
    }
  );
}

function isAuthorized() {
  return Boolean(
    document.querySelector(AUTH_SELECTOR)
  );
}

function createAuthorization$() {
  const domAuthorization$ = new Observable(
    (subscriber) => {
      const emitAuthorization = () => {
        subscriber.next(isAuthorized());
      };

      emitAuthorization();

      const observer = new MutationObserver(
        emitAuthorization
      );

      observer.observe(
        document.documentElement,
        {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class'],
        }
      );

      return () => {
        observer.disconnect();
      };
    }
  ).pipe(
    auditTime(50),
    distinctUntilChanged()
  );

  const loginSuccess$ = interceptXhr(
    LOGIN_ENDPOINT,
    200
  ).pipe(
    map(isAuthorized)
  );

  const logoutSuccess$ = interceptXhr(
    LOGOUT_ENDPOINT,
    200
  ).pipe(
    map(() => false)
  );

  return merge(
    domAuthorization$,
    loginSuccess$,
    logoutSuccess$
  ).pipe(
    distinctUntilChanged()
  );
}

function createContent$() {
  return createAuthorization$().pipe(
    switchMap((authorized) => {
      if (!authorized) {
        return of({
          authorized: false,
          clientName: '',
        });
      }

      return defer(() => {
        return from(
          getCustomerName(AUTH_SELECTOR)
        );
      }).pipe(
        map((name) => {
          if (!isAuthorized()) {
            return {
              authorized: false,
              clientName: '',
            };
          }

          return {
            authorized: true,
            clientName:
              String(name || '').trim(),
          };
        }),
        catchError((error) => {
          console.error(
            '[Elite] Не удалось получить имя клиента:',
            error
          );

          return of({
            authorized: true,
            clientName: '',
          });
        })
      );
    }),
    distinctUntilChanged((previous, current) => {
      return (
        previous.authorized === current.authorized &&
        previous.clientName === current.clientName
      );
    })
  );
}

function createContentElement(tagName, text) {
  const element = document.createElement(tagName);
  element.textContent = text;
  return element;
}

function renderContent(content) {
  const contentElements =
    document.querySelectorAll(
      PERSONALIZED_CONTENT_SELECTOR
    );

  contentElements.forEach((element) => {
    const hasClientName = Boolean(
      content.clientName
    );

    const description =
      `${hasClientName ? 'с' : 'С'}оберите идеальное путешествие\n` +
      'под ваш неповторимый стиль.';

    const contentNodes = [
      createContentElement('p', description),
    ];

    if (hasClientName) {
      contentNodes.unshift(
        createContentElement(
          'h3',
          `${content.clientName},`
        )
      );
    }

    element.replaceChildren(...contentNodes);
  });
}

function observeHeaderMarkup() {
  return reactDomObserver()
    .observeSelector$(HEADER_SELECTOR, {
      emitRemove: false,
    })
    .subscribe(({element: header}) => {
      if (
        document.querySelector(
          POPUP_TRIGGER_SELECTOR
        )
      ) {
        return;
      }

      header.insertAdjacentHTML(
        'afterend',
        markup
      );
    });
}

async function mountPopup() {
  await customElements.whenDefined(
    'coral-popup'
  );

  let popup = document.querySelector(
    POPUP_SELECTOR
  );

  if (!popup) {
    document.body.insertAdjacentHTML(
      'beforeend',
      popupMarkup
    );

    popup = document.querySelector(
      POPUP_SELECTOR
    );
  }

  bindShadowCloseMetric(popup);
}

function bindPopupInteractions() {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const popup = document.querySelector(
      POPUP_SELECTOR
    );

    const learnMoreLink = event.target.closest(
      `${POPUP_SELECTOR} .learn-more`
    );

    if (
      learnMoreLink &&
      typeof window.ym === 'function'
    ) {
      window.ym(
        96674199,
        'reachGoal',
        'entry-point',
        {
          name_stock: {
            capsula: {
              name_point: 'pop_up_elite',
            },
          },
        }
      );

      sendCapsulaClickMetric('learn_more');
    }

    if (
      event.target.closest(
        POPUP_TRIGGER_SELECTOR
      )
    ) {
      if (typeof window.ym === 'function') {
        window.ym(
          96674199,
          'reachGoal',
          'capsula_elite_pop_up_click_to_show'
        );
      }

      popup?.show();
      return;
    }

    const noThanksButton = event.target.closest(
      `${POPUP_SELECTOR} .close-btn`
    );

    if (noThanksButton) {
      const currentPopup = noThanksButton.closest(
        POPUP_SELECTOR
      );

      sendCapsulaClickMetric('no_thanks');
      currentPopup?.hide();
      return;
    }

  });
}

async function init() {
  let content = {
    authorized: false,
    clientName: '',
  };

  createContent$().subscribe({
    next(nextContent) {
      content = nextContent;
      renderContent(content);
    },
    error(error) {
      console.error(
        '[Elite] Ошибка отслеживания авторизации:',
        error
      );
    },
  });

  observeHeaderMarkup();
  bindPopupInteractions();

  await mountPopup();

  renderContent(content);
}

init().catch((error) => {
  console.error(
    '[Elite] Не удалось инициализировать popup:',
    error
  );
});
