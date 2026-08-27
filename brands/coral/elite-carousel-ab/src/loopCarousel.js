/**
 * loopCarousel
 * ============================================================
 * Зацикливание карусели после reinit().
 *
 * ПОЧЕМУ ОТДЕЛЬНЫЙ МОДУЛЬ, А НЕ ПРАВКА НАСТРОЕК GLIDE
 *
 * Логи с боевой страницы показали:
 *
 *   type: 'slider', rewind: false, autoplay: false
 *
 * То есть Glide на сайте настроен как обычный слайдер: он
 * НЕ умеет ходить по кругу и на последнем слайде просто
 * упирается в край. Бесконечную прокрутку обеспечивала
 * обвязка сайта поверх библиотеки, и её убивает наш destroy().
 *
 * Попытка включить цикл штатно (type: 'carousel' + rewind)
 * через update() не помогла: для 'carousel' нужны слайды-клоны,
 * а Clones-компонент после destroy()/mount() не пересобирается
 * под изменённый DOM.
 *
 * ПОЭТОМУ ЗДЕСЬ ДРУГОЙ ПОДХОД.
 *
 * Мы не трогаем ни тип карусели, ни клоны, ни внутренности
 * Glide. Мы просто крутим её сами: по таймеру вызываем
 * публичный go(), а дойдя до последнего слайда — возвращаемся
 * на первый через go('=0').
 *
 * Единственное отличие от настоящего `type: 'carousel'` —
 * переход с последнего слайда на первый идёт обратной
 * перемоткой, а не бесшовно вперёд.
 *
 * Отладка: localStorage.coralGlideDebug = '1'
 * ============================================================
 */

const DEBUG =
  typeof localStorage !== 'undefined' &&
  localStorage.getItem('coralGlideDebug') === '1';

function log(...args) {
  if (DEBUG) {
    console.log('[LoopCarousel]', ...args);
  }
}

function logError(...args) {
  if (DEBUG) {
    console.error('[LoopCarousel]', ...args);
  }
}

const DEFAULT_INTERVAL = 5000;

export class LoopCarousel {
  /**
   * @param {object} carousel Экземпляр getCoralGlide.
   * @param {{interval?: number, hoverPause?: boolean}} [options]
   */
  constructor(carousel, options = {}) {
    this.carousel = carousel;

    this.interval = options.interval ?? DEFAULT_INTERVAL;
    this.hoverPause = options.hoverPause ?? true;

    this.timer = null;

    /*
     * Два независимых источника паузы: курсор над каруселью
     * и скрытая вкладка. Держим их раздельно, иначе возврат
     * во вкладку снимал бы паузу, даже если курсор всё ещё
     * над каруселью.
     */
    this.hovered = false;
    this.hidden = false;

    this.onEnter = () => {
      this.hovered = true;
    };

    this.onLeave = () => {
      this.hovered = false;
    };

    /*
     * В фоновой вкладке крутить бессмысленно: пользователь
     * этого не видит, а браузер всё равно тормозит таймеры.
     */
    this.onVisibilityChange = () => {
      this.hidden = document.hidden;
    };
  }

  /**
   * Крутить или ждать.
   */
  get paused() {
    return this.hovered || this.hidden;
  }

  /**
   * Сколько слайдов видно одновременно.
   *
   * Нужно, чтобы понять, где заканчивается прокрутка: при
   * perView > 1 последний слайд достигается раньше, иначе
   * справа осталась бы пустота.
   */
  get perView() {
    try {
      return this.carousel.instance?.settings?.perView ?? 1;
    } catch (error) {
      logError('Failed to read perView', error);
      return 1;
    }
  }

  /**
   * Индекс, после которого возвращаемся в начало.
   *
   * Считается каждый раз заново: количество слайдов и perView
   * могут измениться (адаптив, breakpoints).
   */
  get lastIndex() {
    const configuredLast =
      this.carousel.lastIndex ??
      this.carousel.slides.length - 1;

    return Math.max(
      this.carousel.firstIndex ?? 0,
      configuredLast - this.perView + 1,
    );
  }

  get firstIndex() {
    return this.carousel.firstIndex ?? 0;
  }

  /**
   * Один шаг прокрутки. Только публичный API Glide.
   */
  step() {
    if (this.paused) {
      return;
    }

    const glide = this.carousel.instance;

    if (!glide) {
      return;
    }

    try {
      /*
       * Границу считаем каждый раз заново: количество слайдов
       * задаётся снаружи (removeFirst/keepFirst с любым
       * count), а perView может меняться на брейкпоинтах.
       *
       * Сравнение именно `>=`: при perView > 1 прокрутка
       * заканчивается раньше последнего слайда, иначе справа
       * образуется пустота. А если index почему-то уже
       * перескочил границу, мы всё равно вернёмся в начало,
       * а не уедем дальше в никуда.
       */
      if (glide.index >= this.lastIndex) {
        glide.go(`=${this.firstIndex}`);
        log('Loop: back to first slide');
      } else {
        glide.go('>');
      }
    } catch (error) {
      /*
       * Если карусель успели уничтожить, продолжать нельзя:
       * иначе таймер будет молча сыпать ошибками до конца
       * жизни страницы.
       */
      logError('Step failed, stopping', error);
      this.stop();
    }
  }

  /**
   * Запускает прокрутку. Ждёт готовности карусели.
   */
  async start() {
    await this.carousel.ready;

    if (this.timer) {
      return this;
    }

    /*
     * Если слайдов не больше, чем помещается на экран,
     * крутить нечего.
     */
    const visibleSlides =
      this.lastIndex - this.firstIndex + 1;

    if (visibleSlides <= this.perView) {
      log('Nothing to loop', {
        slides: visibleSlides,
        perView: this.perView,
      });

      return this;
    }

    this.timer = setInterval(() => this.step(), this.interval);

    if (this.hoverPause && this.carousel.root) {
      this.carousel.root.addEventListener('mouseenter', this.onEnter);
      this.carousel.root.addEventListener('mouseleave', this.onLeave);
    }

    document.addEventListener(
      'visibilitychange',
      this.onVisibilityChange,
    );

    log('Started', {
      interval: this.interval,
      slides: this.carousel.slides.length,
      perView: this.perView,
      lastIndex: this.lastIndex,
    });

    return this;
  }

  /**
   * Останавливает прокрутку и снимает все обработчики.
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    if (this.carousel.root) {
      this.carousel.root.removeEventListener('mouseenter', this.onEnter);
      this.carousel.root.removeEventListener('mouseleave', this.onLeave);
    }

    document.removeEventListener(
      'visibilitychange',
      this.onVisibilityChange,
    );

    log('Stopped');

    return this;
  }
}

/**
 * Короткий способ включить зацикливание.
 *
 * @param {object} carousel Экземпляр getCoralGlide.
 * @param {{interval?: number, hoverPause?: boolean}} [options]
 */
export function loopCarousel(carousel, options) {
  return new LoopCarousel(carousel, options).start();
}
