import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Acompanha o breakpoint de celular via `matchMedia`.
 *
 * Usa `useSyncExternalStore` em vez de `useState` + `useEffect`: o valor é
 * lido direto da fonte externa durante a renderização, sem render em cascata,
 * e o snapshot do servidor assume desktop (o layout responsivo em CSS já cobre
 * o primeiro paint).
 */
export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(onStoreChange: () => void) {
  const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
}

function getServerSnapshot() {
  return false;
}
