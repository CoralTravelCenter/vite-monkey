import markup from "./markup.html?raw";
import "./style.css";

const popupId = "business-button-modal";
const businessClassStorageKey = "wantsBusinessClass";
const bookingNoteSelector = '[data-testid="reservationNote_text"]';
const businessClassNote = "ХОЧУ БИЗНЕС-КЛАСС";
const popupCloseDelay = 2000;
const buttonContainerSelector =
  '[class*="PackageTourFlightFilter_packageTourFlightFilterButtons"]';

let closePopupTimeout = null;

const reachGoal = (...args) => {
  if (typeof window.ym === "function") {
    window.ym(...args);
  }
};

const hasBusinessClassPreference = () => {
  return localStorage.getItem(businessClassStorageKey) === "true";
};

const setBusinessClassPreference = () => {
  localStorage.setItem(businessClassStorageKey, "true");
};

const isBookingStep = (route = window.location.href) => {
  const url = new URL(route, window.location.origin);
  const {pathname, search} = url;

  return (
    pathname.includes("/booking/add-passenger") &&
    new URLSearchParams(search).get("step") === "2"
  );
};

const isBookingPage = () => {
  return window.location.pathname.includes("/booking/add-passenger");
};

const updateReactTextareaValue = (field, value) => {
  Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value",
  )?.set?.call(field, value);

  field.dispatchEvent(new Event("input", {bubbles: true}));
  field.dispatchEvent(new Event("change", {bubbles: true}));
};

const syncBusinessClassNote = (route) => {
  if (!hasBusinessClassPreference() || !isBookingStep(route)) {
    return;
  }

  const noteField = document.querySelector(bookingNoteSelector);

  if (!(noteField instanceof HTMLTextAreaElement)) {
    return;
  }

  const currentValue = noteField.value.trim();

  if (currentValue.includes(businessClassNote)) {
    return;
  }

  updateReactTextareaValue(
    noteField,
    currentValue
      ? `${currentValue}\n${businessClassNote}`
      : businessClassNote,
  );
};

const subscribeToRouteChanges = () => {
  if (
    !window.CoralRouteBus ||
    typeof window.CoralRouteBus.subscribe !== "function"
  ) {
    return;
  }

  window.CoralRouteBus.subscribe((route) => {
    console.log("route changed:", route);
    requestAnimationFrame(() => syncBusinessClassNote(route));
  });
};

const closePopup = (popup) => {
  popup.hide();

  if (closePopupTimeout) {
    clearTimeout(closePopupTimeout);
    closePopupTimeout = null;
  }
};

const ensurePopup = () => {
  let popup = document.getElementById(popupId);

  if (popup) {
    return popup;
  }

  document.body.insertAdjacentHTML("beforeend", markup);
  popup = document.getElementById(popupId);

  if (!popup) {
    return null;
  }

  const actionButton = popup.querySelector("#trigger-flight");
  const notice = popup.querySelector(".business-button-modal-notice");

  if (!actionButton || !notice) {
    return popup;
  }

  actionButton.addEventListener("click", () => {
    reachGoal(96674199, "reachGoal", "flight_pop_up", {click: "yes"});
    setBusinessClassPreference();
    notice.dataset.visible = "true";

    if (closePopupTimeout) {
      clearTimeout(closePopupTimeout);
    }

    closePopupTimeout = setTimeout(() => {
      closePopup(popup);
    }, popupCloseDelay);
  });

  return popup;
};

const showPopup = async (popup) => {
  if (!popup) {
    return;
  }

  await customElements.whenDefined("coral-popup");

  const notice = popup.querySelector(".business-button-modal-notice");

  if (notice) {
    notice.dataset.visible = "false";
  }

  if (closePopupTimeout) {
    clearTimeout(closePopupTimeout);
    closePopupTimeout = null;
  }

  popup.show();
};

const renderButton = () => {
  const group = document.querySelector(buttonContainerSelector);

  if (!group) {
    return false;
  }

  const existingButton = document.querySelector(".business-button-popup");

  if (existingButton && existingButton.parentElement === group) {
    return true;
  }

  existingButton?.remove();

  const insertPosition = window.innerWidth < 768 ? "afterend" : "beforeend";

  group.insertAdjacentHTML(
    insertPosition,
    `
            <div class="business-button-popup" role="button" tabindex="0">
                <svg style="flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.81855 3.48493C5.35841 3.06933 5.62836 2.86153 5.93992 2.72769C6.0812 2.66701 6.22808 2.61798 6.37885 2.58117C6.71136 2.5 7.06394 2.5 7.7691 2.5H12.2309C12.9361 2.5 13.2887 2.5 13.6212 2.58117C13.7719 2.61798 13.9189 2.66701 14.0601 2.72769C14.3717 2.86153 14.6416 3.06933 15.1815 3.48493C16.9704 4.86207 17.8649 5.55064 18.1714 6.44232C18.3079 6.83894 18.3588 7.25607 18.3215 7.67051C18.2377 8.60225 17.5316 9.455 16.1194 11.1604L12.7915 15.1794C11.5105 16.7265 10.87 17.5 10 17.5C9.13002 17.5 8.48952 16.7265 7.20851 15.1794L3.88061 11.1604C2.46842 9.455 1.76232 8.60225 1.67852 7.67051C1.64125 7.25607 1.69222 6.83894 1.82861 6.44232C2.13522 5.55064 3.02966 4.86207 4.81855 3.48493Z" stroke="white" stroke-width="1.3"/>
                    <path d="M8.33331 7.08334H11.6666" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Бизнес-класс</span>
            </div>
        `,
  );

  const button =
    insertPosition === "afterend"
      ? group.nextElementSibling
      : group.querySelector(".business-button-popup");
  const popup = ensurePopup();

  if (!button) {
    return false;
  }

  const openPopup = async () => {
    reachGoal(96674199, "reachGoal", "flight_pop_up_click_to_show");
    await showPopup(popup);
  };

  button.addEventListener("click", openPopup);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPopup();
    }
  });

  return true;
};

const init = () => {
  if (isBookingPage()) {
    syncBusinessClassNote();
    subscribeToRouteChanges();
    return;
  }

  const observer = new MutationObserver(() => {
    renderButton();
  });

  renderButton();

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

init();
