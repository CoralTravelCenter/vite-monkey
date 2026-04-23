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
    const triggerData = Array.isArray(config.triggers) ? config.triggers : [];

    if (!storiesData.length) return;

    const renderTriggers = () => {
        const list = root.querySelector(".travel-stories__list");

        if (!list || !triggerData.length) return;

        list.innerHTML = triggerData
            .map(
                (item) => `<button class="travel-story" type="button" data-story-id="${escapeHtml(item.id)}">
                    <span class="travel-story__avatar">
                        <img src="${escapeHtml(item.avatar)}" alt="">
                    </span>
                    <span class="travel-story__label">${escapeHtml(item.label)}</span>
                </button>`
            )
            .join("");
    };

    renderTriggers();

    const triggers = Array.from(root.querySelectorAll(TRIGGER_SELECTOR));

    if (!triggers.length) return;

    let modal = null;
    let swiper = null;
    let autoplayTimer = null;
    let activeSlides = [];

    const stopAutoplay = () => {
        if (autoplayTimer) {
            window.clearTimeout(autoplayTimer);
            autoplayTimer = null;
        }
    };

    const closeModal = () => {
        stopAutoplay();

        if (swiper) {
            swiper.destroy(true, true);
            swiper = null;
        }

        if (modal) {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            modal.innerHTML = "";
        }

        document.documentElement.classList.remove("travel-story-modal-lock");
        activeSlides = [];
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

    const renderMedia = (item) => {
        if (item.type === "video") {
            return `<video class="travel-story-modal__media" muted playsinline webkit-playsinline preload="auto" src="${escapeHtml(item.src)}"></video>`;
        }

        return `<img class="travel-story-modal__media" src="${escapeHtml(item.src)}" alt="">`;
    };

    const getSlides = () =>
        storiesData.flatMap((story) =>
            story.items.map((item) => ({
                story,
                item,
            }))
        );

    const getInitialSlideIndex = (storyId) => {
        const index = activeSlides.findIndex(({story}) => story.id === storyId);
        return index >= 0 ? index : 0;
    };

    const renderModal = () => {
        const slides = activeSlides
            .map(({item}) => {
                const themeClass = item.textTheme === "light" ? " is-text-light" : "";
                const title = item.title
                    ? `<h3 class="travel-story-modal__title">${escapeHtml(item.title)}</h3>`
                    : "";
                const subtitle = item.subtitle
                    ? `<p class="travel-story-modal__subtitle">${escapeHtml(item.subtitle)}</p>`
                    : "";
                const link = item.link
                    ? `<a class="travel-story-modal__cta coral-main-btn white" href="${escapeHtml(item.link)}" rel="noopener" target="_blank">${escapeHtml(item.linkText || "Узнать больше")}</a>`
                    : "";

                return `<div class="swiper-slide travel-story-modal__slide${themeClass}">
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

        activeSlides = getSlides();
        const initialSlide = getInitialSlideIndex(storyId);
        renderModal();

        document.documentElement.classList.add("travel-story-modal-lock");
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");

        modal.querySelectorAll("[data-modal-close]").forEach((element) => {
            element.addEventListener("click", closeModal);
        });

        swiper = new Swiper(modal.querySelector(".travel-story-modal__swiper"), {
            slidesPerView: 1,
            initialSlide,
            speed: 260,
            resistanceRatio: 0.7,
            grabCursor: true,
            on: {
                slideChange: startAutoplay,
            },
        });

        startAutoplay();
    };

    modal = document.createElement("div");
    modal.className = "travel-story-modal";
    modal.setAttribute("aria-hidden", "true");
    document.body.appendChild(modal);

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
