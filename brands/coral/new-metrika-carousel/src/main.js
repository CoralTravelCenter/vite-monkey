import {watchMainCarouselSlides} from "../../../../utils/index.js";

watchMainCarouselSlides({
  carouselSelector: '.glide__slides.swiper-wrapper',
  mount: ({slide, index}) => {
    const link = slide.querySelector('a[href]');

    if (!link) {
      return null;
    }

    console.log('carousel slide link', {
      index,
      href: link.href,
    });

    return null;
  },
});
