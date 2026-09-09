import * as React from "react";

const noop = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` no servidor e no primeiro render do cliente, `true` depois da
 * hidratação. Útil para valores que só existem no navegador (tema resolvido,
 * fuso horário) sem provocar divergência de hidratação.
 */
export function useMounted() {
  return React.useSyncExternalStore(noop, getSnapshot, getServerSnapshot);
}
