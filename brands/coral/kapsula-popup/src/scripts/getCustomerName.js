export function getCustomerName(AUTH_BUTTON_SELECTOR) {
  const isAuthorized = Boolean(
    document.querySelector(AUTH_BUTTON_SELECTOR)
  );

  if (!isAuthorized) {
    return Promise.resolve('');
  }

  return new Promise((resolve) => {
    if (typeof window.mindbox !== 'function') {
      resolve('');
      return;
    }

    window.mindbox('sync', {
      operation: 'getUserName',

      onSuccess(response) {
        const stillAuthorized = Boolean(
          document.querySelector(AUTH_BUTTON_SELECTOR)
        );

        if (!stillAuthorized) {
          resolve('');
          return;
        }

        const firstName =
          response?.customer?.firstName?.trim() || '';

        resolve(firstName);
      },

      onValidationError() {
        resolve('');
      },

      onError() {
        resolve('');
      },
    });
  });
}
