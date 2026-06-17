import Glide from '@glidejs/glide';

import {
  ROOT_SELECTOR,
  ORIGINAL_SLIDE_SELECTOR,
  MAX_SLIDES,
  CUSTOM_SLIDER_CLASS,
} from './constants.js';
import {removeDuplicateIds} from './dom.js';

const ACTIVE_SLIDE_CLASS = 'glide__slide--active';
const ACTIVE_BULLET_CLASS = 'glide__bullet--active';
const DEFAULT_MANAGED_SLIDE_DELAY = 5000;
const DEFAULT_MANAGED_TRANSITION_MS = 600;

export function loadGlide() {
  return Promise.resolve(Glide);
}

function getOriginalSlides(root) {
  return getAllAvailableOriginalSlides(root).slice(0, MAX_SLIDES);
}

function getAllAvailableOriginalSlides(root) {
  return Array.from(root.querySelectorAll(ORIGINAL_SLIDE_SELECTOR))
    .filter(slide => {
      return (
        slide.children.length > 0 &&
        !slide.classList.contains('glide__slide--clone')
      );
    });
}

function getAllOriginalSlides(root) {
  return getAllRenderedSlides(root);
}

function getAllRenderedSlides(root) {
  return Array.from(root.querySelectorAll(ORIGINAL_SLIDE_SELECTOR));
}

function getManagedSlides(root) {
  return getAllRenderedSlides(root).slice(0, MAX_SLIDES);
}

function getSlidesTrack(root) {
  return root?.querySelector('.glide__slides') || null;
}

function getOriginalBulletControls(root) {
  return Array.from(root.querySelectorAll('[data-glide-dir]')).filter(control => {
    const rawIndex = control.getAttribute('data-glide-dir') || '';
    const index = Number(rawIndex.replace('=', ''));
    return Number.isFinite(index);
  });
}

function getActiveSlideIndex(slides) {
  return slides.findIndex(slide => slide.classList.contains(ACTIVE_SLIDE_CLASS));
}

function normalizeManagedIndex(index, totalSlides = MAX_SLIDES) {
  if (totalSlides <= 0) {
    return 0;
  }

  if (index < 0) {
    return 0;
  }

  return index % totalSlides;
}

function ensureManagedTrackSnapshot(root) {
  const track = getSlidesTrack(root);

  if (!track || root.__miniPageManagedTrackBaseStyle !== undefined) {
    return track;
  }

  root.__miniPageManagedTrackBaseStyle = track.getAttribute('style') || '';
  return track;
}

function removeManagedTrackStyleProperty(styleText, propertyName) {
  const pattern = new RegExp(`${propertyName}\\s*:\\s*[^;]+;?`, 'gi');
  return styleText.replace(pattern, '').trim();
}

function buildManagedTrackStyle(root, slideIndex) {
  const track = ensureManagedTrackSnapshot(root);
  const slides = getManagedSlides(root);

  if (!track || slides.length === 0) {
    return '';
  }

  const baseStyle = root.__miniPageManagedTrackBaseStyle || '';
  const withoutTransform = removeManagedTrackStyleProperty(baseStyle, 'transform');
  const cleanedStyle = removeManagedTrackStyleProperty(withoutTransform, 'transition-duration');
  const normalizedIndex = normalizeManagedIndex(slideIndex, slides.length);
  const slideWidth = slides[0].getBoundingClientRect().width || slides[0].offsetWidth || 0;
  const translateX = -(slideWidth * normalizedIndex);
  const styleParts = [];

  if (cleanedStyle) {
    styleParts.push(cleanedStyle.endsWith(';') ? cleanedStyle : `${cleanedStyle};`);
  }

  styleParts.push(`transform: translate3d(${translateX}px, 0px, 0px);`);
  styleParts.push(`transition-duration: ${DEFAULT_MANAGED_TRANSITION_MS}ms;`);

  return styleParts.join(' ').trim();
}

function resetManagedTrackPosition(root) {
  const track = ensureManagedTrackSnapshot(root);

  if (!track) {
    return;
  }

  const nextStyle = buildManagedTrackStyle(root, 0);

  if (nextStyle) {
    track.setAttribute('style', nextStyle);
  }
}

function applyManagedTrackStyle(root, slideIndex) {
  const track = ensureManagedTrackSnapshot(root);

  if (!track) {
    return false;
  }

  const nextStyle = buildManagedTrackStyle(root, slideIndex);

  if (!nextStyle) {
    return false;
  }

  track.setAttribute('style', nextStyle);
  return true;
}

function setManagedActiveState(root, activeIndex) {
  const slides = getManagedSlides(root);
  const controls = getOriginalBulletControls(root).filter(control => {
    const rawIndex = control.getAttribute('data-glide-dir') || '';
    const index = Number(rawIndex.replace('=', ''));
    return index < MAX_SLIDES;
  });

  if (slides.length === 0) {
    return;
  }

  const normalizedIndex = normalizeManagedIndex(activeIndex, slides.length);

  slides.forEach((slide, index) => {
    slide.classList.toggle(ACTIVE_SLIDE_CLASS, index === normalizedIndex);
    slide.setAttribute('aria-hidden', index === normalizedIndex ? 'false' : 'true');
  });

  controls.forEach(control => {
    const rawIndex = control.getAttribute('data-glide-dir') || '';
    const index = Number(rawIndex.replace('=', ''));
    control.classList.toggle(ACTIVE_BULLET_CLASS, index === normalizedIndex);
    control.setAttribute('aria-current', index === normalizedIndex ? 'true' : 'false');
  });
}

function createSlideClone(slide) {
  const clonedSlide = slide.cloneNode(true);

  clonedSlide.className = 'glide__slide';
  clonedSlide.classList.remove('glide__slide--active');
  removeDuplicateIds(clonedSlide);

  return clonedSlide;
}

function getCustomSliderNearRoot(root) {
  return root?.querySelector(`:scope > .${CUSTOM_SLIDER_CLASS}`) || null;
}

function getSlidesSignature(slides) {
  return slides
    .map(slide => {
      const link = slide.querySelector('a')?.getAttribute('href') || '';
      const image = slide.querySelector('img')?.getAttribute('src') || '';
      const text = slide.textContent?.trim().slice(0, 120) || '';

      return `${link}::${image}::${text}`;
    })
    .join('|');
}

function hideOriginalBanner(root) {
  if (!root) {
    return;
  }

  root.style.display = 'none';
  root.style.visibility = 'hidden';
  root.style.pointerEvents = 'none';
  root.setAttribute('aria-hidden', 'true');
  root.setAttribute('inert', '');
}

function showOriginalBanner(root) {
  if (!root) {
    return;
  }

  root.style.display = '';
  root.style.visibility = '';
  root.style.pointerEvents = '';
  root.removeAttribute('aria-hidden');
  root.removeAttribute('inert');
}

function hideCustomSlider(slider) {
  if (!slider) {
    return;
  }

  slider.hidden = true;
  slider.setAttribute('aria-hidden', 'true');
}

function limitOriginalBannerSlides(root) {
  if (!root) {
    return;
  }

  const allSlides = getAllRenderedSlides(root);

  if (allSlides.length <= MAX_SLIDES) {
    root.dataset.originalSlidesLimited = 'true';
    return;
  }

  allSlides.slice(MAX_SLIDES).forEach(slide => {
    slide.remove();
  });

  getOriginalBulletControls(root).forEach(control => {
    const rawIndex = control.getAttribute('data-glide-dir') || '';
    const index = Number(rawIndex.replace('=', ''));

    if (index >= MAX_SLIDES) {
      control.remove();
    }
  });

  root.dataset.originalSlidesLimited = 'true';
}

function startManagedActiveCycle(root, initialIndex) {
  if (!root || root.__miniPageManagedActiveInterval) {
    return;
  }

  ensureManagedTrackSnapshot(root);
  root.__miniPageManagedActiveIndex = normalizeManagedIndex(initialIndex, getManagedSlides(root).length);
  root.__miniPageManagedIsHovered = false;

  applyManagedTrackStyle(root, root.__miniPageManagedActiveIndex);
  setManagedActiveState(root, root.__miniPageManagedActiveIndex);

  if (!root.__miniPageManagedHoverBound) {
    root.addEventListener('mouseenter', () => {
      root.__miniPageManagedIsHovered = true;
    });

    root.addEventListener('mouseleave', () => {
      root.__miniPageManagedIsHovered = false;
    });

    root.__miniPageManagedHoverBound = true;
  }

  if (!root.__miniPageManagedBulletBound) {
    root.addEventListener('click', event => {
      const control = event.target.closest('[data-glide-dir]');

      if (!control) {
        return;
      }

      const rawIndex = control.getAttribute('data-glide-dir') || '';
      const index = Number(rawIndex.replace('=', ''));

      if (!Number.isFinite(index) || index >= MAX_SLIDES) {
        return;
      }

      root.__miniPageManagedActiveIndex = index;
      applyManagedTrackStyle(root, index);
      setManagedActiveState(root, index);
    });

    root.__miniPageManagedBulletBound = true;
  }

  root.__miniPageManagedActiveInterval = window.setInterval(() => {
    const slides = getManagedSlides(root);

    if (slides.length === 0 || root.__miniPageManagedIsHovered) {
      return;
    }

    const currentActiveIndex = getActiveSlideIndex(slides);
    const baseIndex = currentActiveIndex === -1
      ? root.__miniPageManagedActiveIndex
      : currentActiveIndex;
    const nextIndex = normalizeManagedIndex(baseIndex + 1, slides.length);

    if (baseIndex === slides.length - 1 && nextIndex === 0) {
      resetManagedTrackPosition(root);
    } else {
      applyManagedTrackStyle(root, nextIndex);
    }

    root.__miniPageManagedActiveIndex = nextIndex;
    root.__miniPageManagedTransitionLockUntil = Date.now() + DEFAULT_MANAGED_TRANSITION_MS + 150;
    setManagedActiveState(root, root.__miniPageManagedActiveIndex);
  }, DEFAULT_MANAGED_SLIDE_DELAY);
}

function enableManagedOriginalSlider(root, activeIndex) {
  if (!root) {
    return;
  }

  limitOriginalBannerSlides(root);

  if (getAllRenderedSlides(root).length === 0) {
    return;
  }

  startManagedActiveCycle(root, activeIndex);
  root.dataset.originalSlidesManaged = 'true';
}

export function syncOriginalSliderActiveState() {
  const root = document.querySelector(ROOT_SELECTOR);

  if (!root) {
    return false;
  }

  limitOriginalBannerSlides(root);

  const originalSlides = getAllRenderedSlides(root);

  if (originalSlides.length === 0) {
    return false;
  }

  if (!root.__miniPageManagedActiveInterval) {
    startManagedActiveCycle(root, getActiveSlideIndex(originalSlides));
    root.dataset.originalSlidesManaged = 'true';
  } else {
    const managedSlides = getManagedSlides(root);

    if (managedSlides.length === 0) {
      return false;
    }

    if (Date.now() < (root.__miniPageManagedTransitionLockUntil || 0)) {
      return true;
    }

    root.__miniPageManagedActiveIndex = normalizeManagedIndex(
      root.__miniPageManagedActiveIndex,
      managedSlides.length
    );
    applyManagedTrackStyle(root, root.__miniPageManagedActiveIndex);
    setManagedActiveState(root, root.__miniPageManagedActiveIndex);
  }

  return true;
}

function destroySliderInstance(slider) {
  if (slider?.__miniPageGlideInstance) {
    slider.__miniPageGlideInstance.destroy();
    slider.__miniPageGlideInstance = null;
  }
}

function createSliderStructure() {
  const customSlider = document.createElement('div');
  customSlider.className = `${CUSTOM_SLIDER_CLASS} glide`;

  const track = document.createElement('div');
  track.className = 'glide__track';
  track.setAttribute('data-glide-el', 'track');

  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'glide__slides';

  const bulletsWrapper = document.createElement('div');
  bulletsWrapper.className = 'glide__bullets';
  bulletsWrapper.setAttribute('data-glide-el', 'controls[nav]');

  track.appendChild(slidesWrapper);
  customSlider.append(track, bulletsWrapper);

  return {
    customSlider,
    slidesWrapper,
    bulletsWrapper,
  };
}

function createBullet(index) {
  const bullet = document.createElement('button');
  bullet.type = 'button';
  bullet.className = 'glide__bullet';
  bullet.setAttribute('data-glide-dir', `=${index}`);
  bullet.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
  return bullet;
}

function buildCustomSlider(slides) {
  const {customSlider, slidesWrapper, bulletsWrapper} = createSliderStructure();

  slides.forEach((slide, index) => {
    slidesWrapper.appendChild(createSlideClone(slide));
    bulletsWrapper.appendChild(createBullet(index));
  });

  customSlider.dataset.slidesSignature = getSlidesSignature(slides);

  return customSlider;
}

function mountSlider(slider) {
  const glide = new Glide(slider, {
    type: 'carousel',
    startAt: 0,
    perView: 1,
    autoplay: 5000,
    hoverpause: true,
    animationDuration: 600,
    animationTimingFunc: 'ease',
    gap: 0,
  });

  glide.mount();
  slider.__miniPageGlideInstance = glide;
}

export function replaceMainBannerWithCustomSlider() {
  const root = document.querySelector(ROOT_SELECTOR);

  if (!root) {
    return false;
  }

  const availableSlides = getAllAvailableOriginalSlides(root);

  if (availableSlides.length < MAX_SLIDES) {
    return false;
  }

  const originalSlides = getOriginalSlides(root);

  if (originalSlides.length === 0) {
    return false;
  }

  const slidesSignature = getSlidesSignature(originalSlides);
  const existingSlider = getCustomSliderNearRoot(root);

  if (existingSlider?.dataset.slidesSignature === slidesSignature) {
    existingSlider.hidden = false;
    existingSlider.removeAttribute('aria-hidden');
    hideOriginalBanner(root);
    root.dataset.customSliderInitialized = 'true';
    return true;
  }

  if (existingSlider) {
    destroySliderInstance(existingSlider);
    existingSlider.remove();
  }

  const customSlider = buildCustomSlider(originalSlides);

  root.append(customSlider);

  try {
    mountSlider(customSlider);
    customSlider.hidden = false;
    customSlider.removeAttribute('aria-hidden');
    hideOriginalBanner(root);
    root.dataset.customSliderInitialized = 'true';
  } catch (error) {
    customSlider.remove();
    console.error('[MiniPage] Failed to mount custom slider', error);
    return false;
  }

  return true;
}
