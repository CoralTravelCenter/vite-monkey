import markup from "./markup.html?raw";
import mobileMarkup from "./markup-m.html?raw";
import "./style.css";
import "./popup-style.css";

const coral = {
  phone: "+7 (495) 258 67 08",
  calendarImage: "https://b2ccdn.coral.ru/content/calendar_icon_1.svg",
  planeImage: "https://b2ccdn.coral.ru/content/ees-plane-icon.webp",
  buttonTag: "coral-button",
  nestedButton: true,
  buttonAttributes: { trait: "vivid", shape: "rounded", size: "medium" },
};

const brands = {
  coral,
  sunmar: {
    ...coral,
    phone: "+7 (495) 775 11 50",
    calendarImage: "https://b2ccdn.sunmar.ru/content/calendar_icon%201.svg",
    planeImage: "https://b2ccdn.sunmar.ru/content/ees-plane-icon.webp",
    buttonTag: "sunmar-button",
    nestedButton: false,
    buttonAttributes: { type: "primary" },
  },
};

(() => {
  if (document.getElementById("ees-attention")) return;

  const brand = /(^|\.)sunmar\.ru$/i.test(window.location.hostname)
    ? "sunmar"
    : "coral";
  const settings = brands[brand];
  const root = document.createElement("div");
  root.id = "ees-attention";
  root.dataset.brand = brand;
  root.innerHTML = markup + mobileMarkup;
  root.style.setProperty(
    "--ees-attention-plane",
    `url("${settings.planeImage}")`,
  );
  root.querySelector("[data-ees-calendar]").src = settings.calendarImage;
  const phoneLink = root.querySelector("[data-ees-phone]");
  phoneLink.textContent = settings.phone;
  phoneLink.href = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;

  for (const placeholder of root.querySelectorAll("[data-ees-button]")) {
    const button = document.createElement(settings.buttonTag);
    button.className = placeholder.className;
    button.classList.toggle(
      "ees-attention__action--sunmar",
      brand === "sunmar",
    );
    for (const [name, value] of Object.entries(settings.buttonAttributes)) {
      button.setAttribute(name, value);
    }
    if (settings.nestedButton) {
      button.append(...placeholder.childNodes);
    } else {
      const nativeButton = placeholder.querySelector("button");
      for (const { name, value } of nativeButton.attributes) {
        if (name === "type") continue;
        button.setAttribute(name, value);
      }
      button.append(...nativeButton.childNodes);
    }
    placeholder.replaceWith(button);
  }

  document.body.append(root);

  const trigger = root.querySelector("#ees-attention-trigger");
  const popup = root.querySelector("#ees-attention-popup");
  const dialog = root.querySelector("#ees-attention-dialog");
  const openButton = trigger.querySelector('[data-action="open"]');
  const closeButton = popup.querySelector('[data-action="close"]');
  const desktop = window.matchMedia("(min-width: 768px)");
  const controller = new AbortController();
  const options = { signal: controller.signal };

  function syncScrollLock() {
    document.documentElement.classList.toggle(
      "ees-attention-modal-open",
      dialog.open,
    );
  }

  function syncViewport() {
    if (dialog.open) dialog.close();
    popup.classList.toggle("ees-attention__card--desktop", desktop.matches);
    trigger.hidden = !desktop.matches;
    popup.hidden = desktop.matches;

    if (desktop.matches) {
      root.insertBefore(popup, dialog);
    } else {
      dialog.append(popup);
      dialog.showModal();
    }
    syncScrollLock();
  }

  openButton.addEventListener(
    "click",
    () => {
      trigger.hidden = true;
      popup.hidden = false;
      closeButton.focus();
    },
    options,
  );

  closeButton.addEventListener(
    "click",
    () => {
      if (desktop.matches) {
        popup.hidden = true;
        trigger.hidden = false;
        openButton.focus();
      } else {
        dialog.close();
        syncScrollLock();
      }
    },
    options,
  );

  dialog.addEventListener("close", syncScrollLock, options);
  desktop.addEventListener("change", syncViewport, options);
  syncViewport();

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      controller.abort();
      dialog.close();
      document.documentElement.classList.remove("ees-attention-modal-open");
      root.remove();
    });
  }
})();
