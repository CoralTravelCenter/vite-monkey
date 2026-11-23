import markup from "./markup.html?raw";

const buttonId = "ptff-turkish-airlines-btn";
const quickFilterAttribute = "data-ptff-quick-filter";
const regularTabSelector =
  '[data-testid="ptff-filter"] [data-testid="ptff-regular-tab-btn"]';
const resetFilterSelector = '[data-testid="ptff-reset-filter-btn"]';
const closeFilterSelector = '[data-testid="ptff-close-filter-btn"]';
const checkboxSelector = 'input[type="checkbox"][value="2"]';

let applying = false;
let buttonObserver;
let stopApplying;
let pressed = false;

function setPressed(value) {
  pressed = value;
  document
    .getElementById(buttonId)
    ?.setAttribute("aria-pressed", String(value));
}

function getDrawer() {
  return document.querySelector(resetFilterSelector)?.closest(".ant-drawer");
}

function selectTurkishAirlines(event) {
  if (applying) return;

  const root = document.documentElement;
  const button = event?.currentTarget;
  if (!root || !document.body || !button) return;

  const currentDrawer = getDrawer();
  const alreadyOpen = currentDrawer?.classList.contains("ant-drawer-open");

  const filtersButton = alreadyOpen
    ? undefined
    : [...document.querySelectorAll("button")].find(
        (candidate) =>
          !candidate.disabled &&
          candidate.getClientRects().length > 0 &&
          /^Фильтры(?:\s*\(\d+\))?$/.test((candidate.textContent ?? "").trim()),
      );

  if (!alreadyOpen && !filtersButton) return;

  const shouldSelect = !pressed;
  const selectedDirections = [];
  let closing = false;
  let finished = false;
  let closeFrameId;
  let updateTimeoutId;
  let timeoutId;
  let directionIndex = 0;
  let pendingAction;
  const directions = ["Туда", "Обратно"];
  let cleanupTimeoutId;
  const observer = new MutationObserver(scheduleUpdate);

  function finish() {
    if (finished) return;
    finished = true;
    observer.disconnect();
    window.clearTimeout(timeoutId);
    window.clearTimeout(cleanupTimeoutId);
    window.cancelAnimationFrame(closeFrameId);
    window.clearTimeout(updateTimeoutId);
    root.removeAttribute(quickFilterAttribute);
    applying = false;
    stopApplying = undefined;

    const currentButton = document.getElementById(buttonId);
    if (currentButton) currentButton.disabled = false;
  }

  function closeDrawer() {
    if (finished) return;
    try {
      getDrawer()
        ?.querySelector(`${closeFilterSelector}:not(:disabled)`)
        ?.click();
    } catch (error) {
      console.warn("[ta-filter-highlight] Не удалось закрыть фильтры", error);
      finish();
    }
  }

  function handleTimeout() {
    if (finished) return;
    if (alreadyOpen || !getDrawer()?.classList.contains("ant-drawer-open")) {
      finish();
      return;
    }

    // Даём панели закрыться штатно, пока действует скрытие.
    if (closing) {
      finish();
      return;
    }
    closing = true;
    cleanupTimeoutId = window.setTimeout(finish, 1000);
    closeDrawer();
  }

  function scheduleUpdate() {
    if (finished || updateTimeoutId !== undefined) return;
    updateTimeoutId = window.setTimeout(() => {
      updateTimeoutId = undefined;
      try {
        update();
      } catch (error) {
        console.warn(
          "[ta-filter-highlight] Не удалось применить фильтры",
          error,
        );
        handleTimeout();
      }
    }, 50);
  }

  function update() {
    const drawer = getDrawer();

    if (closing) {
      if (
        !drawer ||
        !drawer.classList.contains("ant-drawer-open") ||
        drawer.querySelector(".ant-drawer-content-wrapper-hidden")
      ) {
        finish();
      }

      return;
    }

    if (!drawer?.classList.contains("ant-drawer-open")) return;

    if (directionIndex < directions.length) {
      const section = [...drawer.querySelectorAll(".ant-collapse-item")].find(
        (item) =>
          item.querySelector(".ant-collapse-header")?.textContent?.trim() ===
          "Авиакомпании",
      );
      if (!section) return;

      const direction = [...section.querySelectorAll("label")]
        .find(
          (label) => label.textContent?.trim() === directions[directionIndex],
        )
        ?.querySelector('input[type="radio"]');
      if (pendingAction) scheduleUpdate();
      if (!direction || direction.disabled) return;

      if (!direction.checked) {
        // Не повторяем клик, пока React не подтвердит предыдущее действие.
        if (pendingAction) return;
        pendingAction = "direction";
        direction.click();
        scheduleUpdate();
        return;
      }

      if (pendingAction === "direction") {
        pendingAction = undefined;
        scheduleUpdate();
        return;
      }

      // Получаем актуальный checkbox после переключения направления.
      const checkbox = section.querySelector(checkboxSelector);
      if (
        pendingAction === "checkbox" &&
        (!checkbox || checkbox.checked !== shouldSelect)
      )
        return;

      if (checkbox && !checkbox.disabled && checkbox.checked !== shouldSelect) {
        pendingAction = "checkbox";
        checkbox.click();
        scheduleUpdate();
        return;
      }

      selectedDirections.push(checkbox?.checked === true);
      if (!checkbox?.checked) setPressed(false);
      directionIndex += 1;
      pendingAction = undefined;
      scheduleUpdate();
      return;
    }

    setPressed(selectedDirections.every(Boolean));

    if (alreadyOpen) {
      finish();
      return;
    }

    closing = true;
    cleanupTimeoutId = window.setTimeout(finish, 1000);
    // После выбора Coral может перерисовать содержимое панели.
    closeFrameId = window.requestAnimationFrame(closeDrawer);
  }

  applying = true;
  stopApplying = handleTimeout;
  try {
    button.disabled = true;
    if (!alreadyOpen) root.setAttribute(quickFilterAttribute, "");
    timeoutId = window.setTimeout(handleTimeout, 5000);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "disabled", "checked"],
    });

    if (!alreadyOpen) filtersButton.click();
    scheduleUpdate();
  } catch (error) {
    console.warn("[ta-filter-highlight] Не удалось запустить фильтры", error);
    handleTimeout();
  }
}

export function syncButton(visible) {
  if (!visible) {
    buttonObserver?.disconnect();
    buttonObserver = undefined;
    stopApplying?.();
    setPressed(false);
    document.getElementById(buttonId)?.remove();
    return;
  }

  if (!buttonObserver) {
    const root = document.documentElement;
    if (!root) return;
    // Вкладка может появиться или быть заменена после события select_room.
    buttonObserver = new MutationObserver(() => {
      const button = document.getElementById(buttonId);
      if (button?.previousElementSibling?.matches(regularTabSelector)) return;
      insertButton();
    });
    buttonObserver.observe(root, { childList: true, subtree: true });
  }

  insertButton();
}

function insertButton() {
  const regularTab = document.querySelector(regularTabSelector);
  if (!regularTab) return;

  let button = document.getElementById(buttonId);

  if (!button) {
    button = document.createElement("button");
    button.id = buttonId;
    button.type = "button";
    button.className =
      "ant-btn css-var-root ant-btn-default ant-btn-color-default ant-btn-variant-outlined";
    button.innerHTML = markup;
    button.setAttribute("aria-label", "Turkish Airlines");
    button.setAttribute("aria-pressed", String(pressed));
    button.disabled = applying;
    button.addEventListener("click", selectTurkishAirlines);
  }

  if (regularTab.nextElementSibling !== button) {
    regularTab.after(button);
  }
}
