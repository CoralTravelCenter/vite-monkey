import { Subscription, animationFrameScheduler, auditTime } from "rxjs";

import { observeMutations$ } from "./observation/mutation.js";
import { reactDomObserver } from "./observation/selector.js";

const DEFAULT_RENDER_TRIGGER_SELECTOR =
  '[class*="BannerLinkWrapper_bannerLinkWrapper"]';
const DEFAULT_SLIDE_SELECTOR = ".glide__slide.swiper-slide";

const defaultHasContent = (slide) => {
  return slide.children.length > 0 || Boolean(slide.textContent?.trim());
};

const defaultIgnoreSlide = (slide) => {
  return (
    slide.classList.contains("glide__slide--clone") ||
    slide.classList.contains("swiper-slide-duplicate")
  );
};

const getStableSlideIndex = (slide, root, slideSelector, ignoreSlide) => {
  const swiperIndex = slide.getAttribute("data-swiper-slide-index");

  if (
    swiperIndex !== null &&
    swiperIndex !== "" &&
    !Number.isNaN(Number(swiperIndex))
  ) {
    return Number(swiperIndex);
  }

  const slides = [...root.querySelectorAll(slideSelector)].filter(
    (item) => !ignoreSlide(item),
  );

  return slides.indexOf(slide);
};

const toUnmount = (mountResult) => {
  if (typeof mountResult === "function") {
    return mountResult;
  }

  if (typeof mountResult?.unmount === "function") {
    return () => mountResult.unmount();
  }

  return null;
};

export function watchMainCarouselSlides(options = {}) {
  const {
    carouselSelector,
    renderTriggerSelector = DEFAULT_RENDER_TRIGGER_SELECTOR,
    slideSelector = DEFAULT_SLIDE_SELECTOR,
    observer = reactDomObserver(),
    hasContent = defaultHasContent,
    ignoreSlide = defaultIgnoreSlide,
    mount = () => {},
    onRender = () => {},
    onUnmount = () => {},
    observeSubtree = true,
  } = options;

  if (!carouselSelector) {
    throw new Error("watchMainCarouselSlides requires carouselSelector");
  }

  const roots = new Map();
  const rootSubscription = new Subscription();

  const destroySlideController = (controller) => {
    controller.subscription.unsubscribe();

    if (controller.mounted && controller.unmount) {
      controller.unmount();
    }

    if (controller.mounted) {
      controller.mounted = false;
      controller.unmount = null;
      onUnmount(controller.context);
    }
  };

  const syncSlideState = (controller) => {
    const { slide, context } = controller;

    if (!slide.isConnected) {
      destroySlideController(controller);
      return false;
    }

    const nextHasContent = hasContent(slide, context);

    if (nextHasContent && !controller.mounted) {
      context.index = getStableSlideIndex(
        slide,
        context.root,
        slideSelector,
        ignoreSlide,
      );
      controller.unmount = toUnmount(mount(context));
      controller.mounted = true;
    }

    if (!nextHasContent && controller.mounted) {
      if (controller.unmount) {
        controller.unmount();
      }

      onUnmount(context);
      controller.unmount = null;
      controller.mounted = false;
    }

    return true;
  };

  const createSlideController = (slide, rootState) => {
    if (rootState.slides.has(slide)) {
      return rootState.slides.get(slide);
    }

    const context = {
      root: rootState.root,
      slide,
      index: getStableSlideIndex(
        slide,
        rootState.root,
        slideSelector,
        ignoreSlide,
      ),
    };

    const controller = {
      context,
      mounted: false,
      slide,
      subscription: new Subscription(),
      unmount: null,
    };

    controller.subscription.add(
      observeMutations$(slide, {
        childList: true,
        subtree: observeSubtree,
        characterData: true,
      })
        .pipe(auditTime(0, animationFrameScheduler))
        .subscribe(() => {
          if (!syncSlideState(controller)) {
            rootState.slides.delete(slide);
          }
        }),
    );

    rootState.slides.set(slide, controller);
    syncSlideState(controller);

    return controller;
  };

  const syncRootSlides = (rootState) => {
    const slides = [...rootState.root.querySelectorAll(slideSelector)].filter(
      (slide) => !ignoreSlide(slide),
    );
    const currentSlides = new Set(slides);

    slides.forEach((slide) => {
      const controller = rootState.slides.get(slide);

      if (controller) {
        controller.context.index = getStableSlideIndex(
          slide,
          rootState.root,
          slideSelector,
          ignoreSlide,
        );
      }
    });

    slides.forEach((slide) => {
      createSlideController(slide, rootState);
    });

    [...rootState.slides.keys()].forEach((slide) => {
      if (currentSlides.has(slide)) {
        return;
      }

      const controller = rootState.slides.get(slide);
      rootState.slides.delete(slide);
      destroySlideController(controller);
    });
  };

  const destroyRootState = (root) => {
    const rootState = roots.get(root);

    if (!rootState) {
      return;
    }

    rootState.subscription.unsubscribe();
    rootState.slides.forEach((controller) => {
      destroySlideController(controller);
    });
    roots.delete(root);
  };

  const ensureRootState = (root) => {
    if (roots.has(root)) {
      const rootState = roots.get(root);
      syncRootSlides(rootState);
      return rootState;
    }

    const rootState = {
      root,
      slides: new Map(),
      subscription: new Subscription(),
    };

    rootState.subscription.add(
      observeMutations$(root, {
        childList: true,
        subtree: true,
      })
        .pipe(auditTime(0, animationFrameScheduler))
        .subscribe(() => {
          if (!root.isConnected) {
            destroyRootState(root);
            return;
          }

          syncRootSlides(rootState);
        }),
    );

    roots.set(root, rootState);
    onRender({ root });
    syncRootSlides(rootState);

    return rootState;
  };

  const triggerSelector = `${carouselSelector} ${renderTriggerSelector}`;

  rootSubscription.add(
    observer
      .observeSelector$(triggerSelector)
      .subscribe(({ type, element }) => {
        const root = element.closest(carouselSelector);

        if (!root) {
          return;
        }

        if (type === "remove") {
          destroyRootState(root);
          return;
        }

        ensureRootState(root);
      }),
  );

  rootSubscription.add(() => {
    [...roots.keys()].forEach((root) => destroyRootState(root));
  });

  return rootSubscription;
}
