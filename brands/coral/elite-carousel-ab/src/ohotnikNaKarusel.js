export class getCoralGlide {
  constructor(selector = '#quick-search-tab-area') {
    this.selector = selector;

    this.container = null;
    this.root = null;

    this.Glide = null;
    this.instance = null;

    this.ready = this.init();
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /*
   * =========================================================
   * DOM
   * =========================================================
   */

  async waitForElement(timeout = 20000) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeout) {
      const element = document.querySelector(
        this.selector,
      );

      if (element) {
        return element;
      }

      await this.sleep(50);
    }

    throw new Error(
      `[CoralGlide] Element not found: ${this.selector}`,
    );
  }

  async waitForNativeGlide(timeout = 20000) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeout) {
      const root =
        this.container.matches?.('.glide')
          ? this.container
          : this.container.querySelector('.glide');

      if (
        root &&
        (
          root.classList.contains('glide--carousel') ||
          root.classList.contains('glide--slider') ||
          root.querySelector('.glide__slide--active')
        )
      ) {
        return root;
      }

      await this.sleep(50);
    }

    throw new Error(
      `[CoralGlide] Native Glide not initialized: ${this.selector}`,
    );
  }

  /*
   * =========================================================
   * WEBPACK
   * =========================================================
   */

  getWebpackRequire() {
    if (window.__webpackRequire) {
      return window.__webpackRequire;
    }

    const chunkKey = Object.keys(window).find(
      (key) =>
        key.startsWith('webpackChunk') &&
        Array.isArray(window[key]),
    );

    if (!chunkKey) {
      return null;
    }

    let webpackRequire;

    window[chunkKey].push([
      [`coral-glide-${Date.now()}`],
      {},
      (require) => {
        webpackRequire = require;
      },
    ]);

    if (webpackRequire) {
      window.__webpackRequire = webpackRequire;
    }

    return webpackRequire;
  }

  async waitForWebpack(timeout = 20000) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeout) {
      const require = this.getWebpackRequire();

      if (require) {
        return require;
      }

      await this.sleep(100);
    }

    throw new Error(
      '[CoralGlide] Webpack runtime not found',
    );
  }

  /*
   * =========================================================
   * ПОИСК КОНСТРУКТОРА GLIDE
   * =========================================================
   */

  isGlideConstructor(value) {
    if (typeof value !== 'function') {
      return false;
    }

    const proto = value.prototype;

    return Boolean(
      proto &&
      typeof proto.mount === 'function' &&
      typeof proto.destroy === 'function' &&
      typeof proto.go === 'function' &&
      typeof proto.update === 'function',
    );
  }

  findGlideExport(value, depth = 0) {
    if (!value || depth > 3) {
      return null;
    }

    if (this.isGlideConstructor(value)) {
      return value;
    }

    if (
      typeof value !== 'object' &&
      typeof value !== 'function'
    ) {
      return null;
    }

    try {
      for (const child of Object.values(value)) {
        const result = this.findGlideExport(
          child,
          depth + 1,
        );

        if (result) {
          return result;
        }
      }
    } catch {
    }

    return null;
  }

  async findGlideConstructor() {
    if (window.__Glide) {
      return window.__Glide;
    }

    const require = await this.waitForWebpack();

    /*
     * На текущей сборке мы уже нашли Glide
     * в модуле 93542.
     */
    try {
      const exports = require(93542);

      const Glide =
        this.findGlideExport(exports);

      if (Glide) {
        window.__Glide = Glide;

        console.log(
          '[CoralGlide] Glide найден в webpack: 93542',
        );

        return Glide;
      }
    } catch {
    }

    /*
     * Fallback, если номер модуля поменяется
     * после следующей сборки.
     */
    for (
      const [id, factory] of
      Object.entries(require.m ?? {})
      ) {
      const source = String(factory);

      const looksLikeGlide =
        source.includes('glide__slide') ||
        source.includes('glide__track') ||
        (
          source.includes('perView') &&
          source.includes('autoplay')
        );

      if (!looksLikeGlide) {
        continue;
      }

      try {
        const exports = require(id);

        const Glide =
          this.findGlideExport(exports);

        if (!Glide) {
          continue;
        }

        window.__Glide = Glide;

        console.log(
          `[CoralGlide] Glide найден в webpack: ${id}`,
        );

        return Glide;
      } catch {
      }
    }

    throw new Error(
      '[CoralGlide] Glide constructor not found',
    );
  }

  /*
   * =========================================================
   * PROTOTYPE
   * =========================================================
   */

  findDescriptor(prototype, property) {
    let current = prototype;

    while (current) {
      const descriptor =
        Object.getOwnPropertyDescriptor(
          current,
          property,
        );

      if (descriptor) {
        return {
          owner: current,
          descriptor,
        };
      }

      current = Object.getPrototypeOf(current);
    }

    return null;
  }

  /*
   * =========================================================
   * ROOT
   * =========================================================
   */

  resolveRoot(instance) {
    /*
     * Обычно selector у Glide уже является
     * DOM-элементом.
     */
    if (
      instance.selector instanceof Element
    ) {
      return instance.selector;
    }

    if (
      typeof instance.selector === 'string'
    ) {
      return document.querySelector(
        instance.selector,
      );
    }

    /*
     * Fallback для текущей версии Glide.
     */
    const internalRoot =
      instance?._c?.Html?.root;

    if (internalRoot instanceof Element) {
      return internalRoot;
    }

    return null;
  }

  belongsToTarget(instance) {
    const root =
      this.resolveRoot(instance);

    if (!root) {
      return false;
    }

    return (
      root === this.container ||
      this.container.contains(root) ||
      root.contains(this.container)
    );
  }

  /*
   * =========================================================
   * ЗАХВАТ СИСТЕМНОГО INSTANCE
   * =========================================================
   */

  async captureSystemInstance(
    timeout = 10000,
  ) {
    const found =
      this.findDescriptor(
        this.Glide.prototype,
        'settings',
      );

    if (!found) {
      console.log(
        '[CoralGlide] Glide prototype properties:',
      );

      let current =
        this.Glide.prototype;

      while (current) {
        console.log(
          Object.getOwnPropertyNames(current),
        );

        current =
          Object.getPrototypeOf(current);
      }

      throw new Error(
        '[CoralGlide] settings descriptor not found',
      );
    }

    const {
      owner,
      descriptor,
    } = found;

    if (
      typeof descriptor.get !== 'function'
    ) {
      throw new Error(
        '[CoralGlide] settings is not getter',
      );
    }

    const originalGetter =
      descriptor.get;

    const bridge = this;

    let captured = null;

    /*
     * На короткое время подменяем getter.
     *
     * Само значение settings не изменяем.
     */
    Object.defineProperty(
      owner,
      'settings',
      {
        ...descriptor,

        get() {
          const settings =
            originalGetter.call(this);

          if (
            !captured &&
            bridge.belongsToTarget(this)
          ) {
            captured = this;

            console.log(
              '[CoralGlide] System instance captured:',
              this,
            );
          }

          return settings;
        },
      },
    );

    const startedAt = Date.now();

    try {
      while (
        !captured &&
        Date.now() - startedAt < timeout
        ) {
        /*
         * Уже работающий Glide на resize
         * обращается к своим settings.
         */
        window.dispatchEvent(
          new Event('resize'),
        );

        await this.sleep(100);
      }
    } finally {
      /*
       * Обязательно возвращаем оригинальный
       * descriptor.
       */
      Object.defineProperty(
        owner,
        'settings',
        descriptor,
      );
    }

    if (!captured) {
      throw new Error(
        `[CoralGlide] System instance not captured: ${this.selector}`,
      );
    }

    return captured;
  }

  /*
   * =========================================================
   * INIT
   * =========================================================
   */

  async init() {
    /*
     * 1. Ждём React-контейнер.
     */
    this.container =
      await this.waitForElement();

    /*
     * 2. Специально разрешаем системному Glide
     *    полностью инициализироваться.
     */
    await this.waitForNativeGlide();

    /*
     * 3. Получаем класс Glide из webpack.
     */
    this.Glide =
      await this.findGlideConstructor();

    /*
     * 4. Захватываем уже существующий
     *    системный instance.
     */
    this.instance =
      await this.captureSystemInstance();

    /*
     * 5. Получаем конкретный root.
     */
    this.root =
      this.resolveRoot(
        this.instance,
      );

    if (!this.root) {
      throw new Error(
        '[CoralGlide] Glide root not found',
      );
    }

    console.log(
      '[CoralGlide] Ready',
      {
        container: this.container,
        root: this.root,
        instance: this.instance,
      },
    );

    return this;
  }

  /*
   * =========================================================
   * CLEANUP
   * =========================================================
   */

  cleanup() {
    /*
     * destroy() должен убрать clones сам.
     * Это просто страховка.
     */
    this.root
      .querySelectorAll(
        '.glide__slide--clone',
      )
      .forEach((clone) => {
        clone.remove();
      });

    return this;
  }

  renumberBullets() {
    this.container
      .querySelectorAll(
        '.glide__bullet',
      )
      .forEach((bullet, index) => {
        bullet.setAttribute(
          'data-glide-dir',
          `=${index}`,
        );
      });

    return this;
  }

  /*
   * =========================================================
   * REINIT
   * =========================================================
   */

  async reinit(mutator) {
    await this.ready;

    /*
     * Это именно системный Glide instance.
     *
     * Его settings НЕ читаем,
     * НЕ копируем и НЕ изменяем.
     */
    const glide =
      this.instance;

    /*
     * Останавливаем системную карусель.
     */
    glide.destroy();

    /*
     * После destroy убираем возможные
     * оставшиеся clone-слайды.
     */
    this.cleanup();

    /*
     * Меняем реальный DOM.
     */
    mutator?.(this.root);

    /*
     * После удаления первых bullets
     * старые data-glide-dir уже неправильные.
     */
    this.renumberBullets();

    /*
     * Начинаем с первого оставшегося слайда.
     */
    glide.index = 0;

    /*
     * Главное:
     *
     * НИКАКОГО new Glide().
     *
     * Монтируем тот же системный instance.
     * Его исходные настройки остаются внутри него.
     */
    glide.mount();

    console.log(
      '[CoralGlide] Reinitialized',
      {
        slides: this.slides.length,
        bullets: this.bullets.length,
        instance: glide,
      },
    );

    return this;
  }

  /*
   * =========================================================
   * REMOVE FIRST
   * =========================================================
   */

  async removeFirst(count = 3) {
    return this.reinit((root) => {
      const slides = [
        ...root.querySelectorAll(
          '.glide__slide:not(.glide__slide--clone)',
        ),
      ];

      slides
        .slice(0, count)
        .forEach((slide) => {
          slide.remove();
        });

      const bullets = [
        ...this.container.querySelectorAll(
          '.glide__bullet',
        ),
      ];

      bullets
        .slice(0, count)
        .forEach((bullet) => {
          bullet.remove();
        });
    });
  }

  /*
   * =========================================================
   * KEEP FIRST
   * =========================================================
   */

  async keepFirst(count = 3) {
    return this.reinit((root) => {
      const slides = [
        ...root.querySelectorAll(
          '.glide__slide:not(.glide__slide--clone)',
        ),
      ];

      slides
        .slice(count)
        .forEach((slide) => {
          slide.remove();
        });

      const bullets = [
        ...this.container.querySelectorAll(
          '.glide__bullet',
        ),
      ];

      bullets
        .slice(count)
        .forEach((bullet) => {
          bullet.remove();
        });
    });
  }

  /*
   * =========================================================
   * PUBLIC
   * =========================================================
   */

  async go(direction) {
    await this.ready;

    this.instance.go(direction);

    return this;
  }

  async pause() {
    await this.ready;

    this.instance.pause();

    return this;
  }

  async play(interval) {
    await this.ready;

    this.instance.play(interval);

    return this;
  }

  get slides() {
    if (!this.root) {
      return [];
    }

    return [
      ...this.root.querySelectorAll(
        '.glide__slide:not(.glide__slide--clone)',
      ),
    ];
  }

  get bullets() {
    if (!this.container) {
      return [];
    }

    return [
      ...this.container.querySelectorAll(
        '.glide__bullet',
      ),
    ];
  }
}
