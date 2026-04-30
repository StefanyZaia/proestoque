declare global {
  // eslint-disable-next-line no-var
  var __PROESTOQUE_LOGGED_IN__: boolean | undefined;
}

export function isLoggedIn() {
  return globalThis.__PROESTOQUE_LOGGED_IN__ === true;
}

export function setLoggedIn(value: boolean) {
  globalThis.__PROESTOQUE_LOGGED_IN__ = value;
}
