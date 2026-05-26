import markup from "./markup.html?raw";
// import "./stories-config.js";
import Swiper from "swiper";
import "swiper/css";
import "./style.css";

(async () => {
  const HOST_SELECTOR = "#quick-search-tab-area";
  const ROOT_SELECTOR = "[data-travel-stories]";
  const TRIGGER_SELECTOR = ".travel-story[data-story-id]";
  const INIT_ATTR = "data-travel-stories-init";

  const host = document.querySelector(HOST_SELECTOR);
  if (!host) return;

  let root = document.querySelector(ROOT_SELECTOR);

  if (!root) {
    host.insertAdjacentHTML("beforebegin", markup);
    root = document.querySelector(ROOT_SELECTOR);
  }

  if (!root || root.hasAttribute(INIT_ATTR)) return;
  root.setAttribute(INIT_ATTR, "true");

  const escapeHtml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const config = window.JUNE_STORIES_CONFIG || {};
  const storiesData = Array.isArray(config.stories) ? config.stories : [];

  if (!storiesData.length) return;

  const triggers = Array.from(root.querySelectorAll(TRIGGER_SELECTOR));

  if (!triggers.length) return;

  const getSlides = () =>
    storiesData.flatMap((story) =>
      story.items.map((item) => ({
        story,
        item,
      }))
    );

  let modal = null;
  let swiper = null;
  let autoplayTimer = null;
  const activeSlides = getSlides();
  const mediaCleanupMap = new WeakMap();
  const jivoStateMap = new Map();
  const JIVO_SELECTORS = [
    "#jivo-iframe-container",
    "jdiv",
    "iframe[src*='jivosite.com']",
    "iframe[src*='jivo.chat']",
    "[class*='jivo']",
    "[id*='jivo']",
  ];

  if (!activeSlides.length) return;

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const getJivoElements = () =>
    Array.from(document.querySelectorAll(JIVO_SELECTORS.join(", ")))
      .filter((element) => !modal || !modal.contains(element));

  const hideJivo = () => {
    getJivoElements().forEach((element) => {
      if (!jivoStateMap.has(element)) {
        jivoStateMap.set(element, element.style.display);
      }

      element.style.display = "none";
    });
  };

  const restoreJivo = () => {
    jivoStateMap.forEach((display, element) => {
      element.style.display = display;
    });

    jivoStateMap.clear();
  };

  const closeModal = () => {
    stopAutoplay();

    if (modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }

    document.documentElement.classList.remove("travel-story-modal-lock");
    restoreJivo();
  };

  const startAutoplay = () => {
    if (!swiper || !activeSlides.length) return;

    stopAutoplay();

    const currentIndex = swiper.activeIndex;
    const currentSlide = activeSlides[currentIndex];
    const currentItem = currentSlide?.item;
    const duration = Number(currentItem?.length || 5) * 1000;
    const progressItems = Array.from(
      modal.querySelectorAll(".travel-story-modal__progress-item")
    );
    const avatar = modal.querySelector(".travel-story-modal__avatar");
    const name = modal.querySelector(".travel-story-modal__name");

    if (currentSlide) {
      if (avatar) {
        avatar.src = currentSlide.story.photo;
      }

      if (name) {
        name.textContent = currentSlide.story.name;
      }
    }

    progressItems.forEach((item, index) => {
      item.classList.toggle("is-complete", index < currentIndex);
      item.classList.toggle("is-active", index === currentIndex);
      item.style.setProperty("--story-duration", `${duration}ms`);
    });

    autoplayTimer = window.setTimeout(() => {
      if (!swiper || !activeSlides.length) return;

      if (swiper.activeIndex < activeSlides.length - 1) {
        swiper.slideNext();
      } else {
        closeModal();
      }
    }, duration);
  };

  const renderVimeo = (item) => {
    const id = escapeHtml(item.vimeoId);

    return `<div class="travel-story-modal__media-shell travel-story-modal__media-shell--vimeo" data-media-shell>
                <div class="travel-story-modal__media travel-story-modal__vimeo">
                <iframe
                    src="https://player.vimeo.com/video/${id}?background=1&autoplay=1&muted=1&loop=1&autopause=0&playsinline=1&title=0&byline=0&portrait=0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen
                    loading="eager"
                ></iframe>
                </div>
            </div>`;
  };

  const renderMedia = (item) => {
    if (item.vimeoId) {
      return renderVimeo(item);
    }

    if (item.type === "video") {
      return `<video class="travel-story-modal__media" muted playsinline webkit-playsinline preload="auto" src="${escapeHtml(item.src)}"></video>`;
    }

    return `<img class="travel-story-modal__media" src="${escapeHtml(item.src)}" alt="">`;
  };

  const setIframeVisible = (shell, isVisible) => {
    shell.classList.toggle("is-ready", isVisible);
  };

  const initializeVimeoMedia = (shell) => {
    const iframe = shell.querySelector("iframe");
    if (!iframe) return () => {
    };

    const source = iframe.getAttribute("src") || "";
    const url = new URL(source, window.location.href);
    const playerOrigin = url.origin;
    const playerId = `travel-story-vimeo-${Math.random().toString(36).slice(2)}`;

    url.searchParams.set("api", "1");
    url.searchParams.set("player_id", playerId);
    iframe.src = url.toString();

    const onMessage = (event) => {
      if (event.origin !== playerOrigin) return;

      let payload = event.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }

      if (!payload || payload.player_id !== playerId) return;

      if (payload.event === "ready") {
        setIframeVisible(shell, true);
        return;
      }

      if (payload.event === "error") {
        setIframeVisible(shell, false);
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
      iframe.src = "about:blank";
    };
  };

  const initializeSlideMedia = () => {
    modal.querySelectorAll("[data-media-shell]").forEach((shell) => {
      if (mediaCleanupMap.has(shell)) return;

      const cleanup = initializeVimeoMedia(shell);
      mediaCleanupMap.set(shell, cleanup);
    });
  };

  const getInitialSlideIndex = (storyId) => {
    const index = activeSlides.findIndex(({story}) => story.id === storyId);
    return index >= 0 ? index : 0;
  };

  const renderModal = () => {
    const slides = activeSlides
      .map(({item}) => {
        const onClick = item.onclick
          ? ` onclick="${escapeHtml(item.onclick)}"`
          : "";
        const themeClass = item.textTheme === "light" ? " is-text-light" : "";
        const title = item.title
          ? `<h3 class="travel-story-modal__title">${escapeHtml(item.title)}</h3>`
          : "";
        const subtitle = item.subtitle
          ? `<p class="travel-story-modal__subtitle">${escapeHtml(item.subtitle)}</p>`
          : "";
        const link = item.link
          ? `<a class="travel-story-modal__cta coral-main-btn white" href="${escapeHtml(item.link)}" rel="noopener" target="_blank"${onClick}>${escapeHtml(item.linkText || "Узнать больше")}</a>`
          : "";
        const background = item.preview || item.src || item.poster || "";
        const backgroundStyle = background
          ? ` style="background-image: url('${escapeHtml(background)}');"`
          : "";

        return `<div class="swiper-slide travel-story-modal__slide${themeClass}"${backgroundStyle}>
                    ${renderMedia(item)}
                    <div class="travel-story-modal__copy">
                        ${title}
                        ${subtitle}
                    </div>
                    ${link}
                </div>`;
      })
      .join("");

    const progress = activeSlides
      .map(() => `<span class="travel-story-modal__progress-item"><span></span></span>`)
      .join("");
    const firstStory = activeSlides[0]?.story;

    modal.innerHTML = `<div class="travel-story-modal__backdrop" data-modal-close></div>
            <section class="travel-story-modal__card" role="dialog" aria-modal="true" aria-label="Истории">
                <div class="travel-story-modal__progress">${progress}</div>
                <header class="travel-story-modal__header">
                    <img class="travel-story-modal__avatar" src="${escapeHtml(firstStory?.photo || "")}" alt="">
                    <strong class="travel-story-modal__name">${escapeHtml(firstStory?.name || "")}</strong>
                    <button class="travel-story-modal__close" type="button" aria-label="Закрыть" data-modal-close></button>
                </header>
                <div class="swiper travel-story-modal__swiper">
                    <div class="swiper-wrapper">
                        ${slides}
                    </div>
                </div>
            </section>`;
  };

  const openStoryById = (storyId) => {
    if (!storiesData.some((item) => item.id === storyId) || !modal) return;

    const initialSlide = getInitialSlideIndex(storyId);

    document.documentElement.classList.add("travel-story-modal-lock");
    hideJivo();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    if (!swiper) return;

    swiper.slideTo(initialSlide, 0);
    startAutoplay();
  };

  modal = document.createElement("div");
  modal.className = "travel-story-modal";
  modal.setAttribute("aria-hidden", "true");
  document.body.appendChild(modal);

  renderModal();

  modal.querySelectorAll("[data-modal-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  initializeSlideMedia();

  swiper = new Swiper(modal.querySelector(".travel-story-modal__swiper"), {
    slidesPerView: 1,
    initialSlide: 0,
    speed: 260,
    resistanceRatio: 0.7,
    grabCursor: true,
    on: {
      slideChange: startAutoplay,
    },
  });

  window.addEventListener("beforeunload", () => {
    modal.querySelectorAll("[data-media-shell]").forEach((shell) => {
      const cleanup = mediaCleanupMap.get(shell);
      if (typeof cleanup === "function") {
        cleanup();
      }
      mediaCleanupMap.delete(shell);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openStoryById(trigger.dataset.storyId);
    });
  });
})();
