import { reactDomObserver } from "./reactDomObserver.js";

const DEFAULT_SLIDE_SELECTOR =
  '.swiper-slide, .slick-slide, [data-swiper-slide-index], [class*="slide"]';

const getItemIndex = (item, slide, root, itemSelector) => {
  if (slide) {
    const slideIndex = slide.getAttribute("data-swiper-slide-index");

    if (slideIndex !== null) {
      return Number(slideIndex);
    }

    const siblingSlides = [...(slide.parentElement?.children || [])].filter(
      (node) => node.matches?.(DEFAULT_SLIDE_SELECTOR),
    );
    const siblingIndex = siblingSlides.indexOf(slide);

    if (siblingIndex >= 0) {
      return siblingIndex;
    }
  }

  if (!root) {
    return -1;
  }

  return [...root.querySelectorAll(itemSelector)].indexOf(item);
};

export function spyMainCarousel(options = {}) {
  const {
    carouselSelector,
    itemSelector = "a[href]",
    slideSelector = DEFAULT_SLIDE_SELECTOR,
    observer = reactDomObserver(),
    onItem = () => {},
    onClick = () => {},
    attachClickListener = true,
    processedAttribute = "data-main-carousel-spy-bound",
  } = options;

  if (!carouselSelector) {
    throw new Error("spyMainCarousel requires carouselSelector");
  }

  const targetSelector = `${carouselSelector} ${itemSelector}`;

  const subscription = observer
    .observeSelector$(targetSelector, {
      emitRemove: false,
    })
    .subscribe(({ type, element }) => {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const root = element.closest(carouselSelector);

      if (!root) {
        return;
      }

      const slide = element.closest(slideSelector);
      const index = getItemIndex(element, slide, root, itemSelector);
      const context = {
        type,
        root,
        item: element,
        slide,
        href: element.getAttribute("href"),
        index,
      };

      onItem(context);

      if (!attachClickListener || element.hasAttribute(processedAttribute)) {
        return;
      }

      element.addEventListener("click", () => onClick(context));
      element.setAttribute(processedAttribute, "true");
    });

  return {
    subscription,
    stop() {
      subscription.unsubscribe();
    },
  };
}
