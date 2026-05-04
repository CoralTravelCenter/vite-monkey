export function createExitTracker({
                                    onExitIntent,
                                    onLikelyLeave,
                                    hasUnsavedChanges,
                                    endpoint = "/analytics/exit",
                                  }) {
  let exitIntentFired = false;
  let leaveSent = false;

  let lastMouseY = null;
  let lastMouseX = null;
  let lastMoveAt = 0;

  function now() {
    return Date.now();
  }

  function buildPayload(reason, extra = {}) {
    return {
      reason,
      url: location.href,
      title: document.title,
      referrer: document.referrer || null,
      visibilityState: document.visibilityState,
      ts: now(),
      timeOnPageMs: Math.round(performance.now()),
      ...extra,
    };
  }

  function sendExitEvent(reason, extra = {}) {
    if (leaveSent) return;
    leaveSent = true;

    const payload = buildPayload(reason, extra);
    const body = JSON.stringify(payload);

    onLikelyLeave?.(payload);

    // 1. Лучший вариант для простой аналитики
    if (navigator.sendBeacon) {
      const blob = new Blob([body], {
        type: "application/json",
      });

      const queued = navigator.sendBeacon(endpoint, blob);

      if (queued) return;
    }

    // 2. Fallback, если beacon не поставился в очередь
    try {
      fetch(endpoint, {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
        keepalive: true,
        credentials: "same-origin",
      });
    } catch {
      // Здесь уже ничего надёжного сделать нельзя
    }
  }

  function fireExitIntent(reason, extra = {}) {
    if (exitIntentFired) return;
    exitIntentFired = true;

    const payload = buildPayload(reason, extra);

    onExitIntent?.(payload);
  }

  // 1. Ранний exit intent: мышь ушла вверх из viewport
  function onMouseMove(event) {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    lastMoveAt = now();
  }

  function onMouseLeave(event) {
    const leftThroughTop = event.clientY <= 0;
    const wasNearTop = lastMouseY !== null && lastMouseY <= 48;
    const wasRecentMove = now() - lastMoveAt <= 300;

    // Отсекаем уход мыши влево/вправо/вниз
    if (leftThroughTop && wasNearTop && wasRecentMove) {
      fireExitIntent("mouse_left_top", {
        x: lastMouseX,
        y: lastMouseY,
      });
    }
  }

  document.addEventListener("mousemove", onMouseMove, {
    passive: true,
  });

  document.addEventListener("mouseleave", onMouseLeave);

  // 2. Главный фактический сигнал: страница стала скрытой
  function onVisibilityChange() {
    if (document.visibilityState === "hidden") {
      sendExitEvent("visibility_hidden");
    }
  }

  document.addEventListener("visibilitychange", onVisibilityChange);

  // 3. Дополнительный сигнал при навигации / bfcache
  function onPageHide(event) {
    sendExitEvent("pagehide", {
      persisted: event.persisted,
    });
  }

  window.addEventListener("pagehide", onPageHide);

  // 4. Только для несохранённых данных
  function onBeforeUnload(event) {
    if (!hasUnsavedChanges?.()) return;

    event.preventDefault();

    // Нужно для совместимости браузеров
    event.returnValue = "";
  }

  window.addEventListener("beforeunload", onBeforeUnload);

  // 5. Опционально: ловим клики по внешним ссылкам
  function onClick(event) {
    const link = event.target.closest?.("a[href]");

    if (!link) return;

    const url = new URL(link.href, location.href);

    if (url.origin !== location.origin) {
      sendExitEvent("external_link_click", {
        href: url.href,
      });
    }
  }

  document.addEventListener("click", onClick, {
    capture: true,
  });

  return function destroyExitTracker() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseleave", onMouseLeave);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("beforeunload", onBeforeUnload);
    document.removeEventListener("click", onClick, {
      capture: true,
    });
  };
}
