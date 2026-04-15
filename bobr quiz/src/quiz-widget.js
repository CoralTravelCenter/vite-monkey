import cssText from './quiz-widget.scss?inline';

let sharedSheet = null;

if ('replaceSync' in CSSStyleSheet.prototype) {
  sharedSheet = new CSSStyleSheet();
  sharedSheet.replaceSync(cssText);
}

export default class QuizWidget extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    this.rootEl = document.createElement('div');
    this.rootEl.className = 'quiz-root';

    this.shadowRoot.append(this.rootEl);

    this.config = null;
    this.state = 'intro'; // intro | question | result
    this.currentStep = 0;
    this.answers = [];

    this._bound = false;
    this._stylesAttached = false;
    this._autoNextTimer = null;
    this._windowDataHandler = null;
    this._finalClickInProgress = false;
  }

  connectedCallback() {
    this.attachStyles();

    if (!this._bound) {
      this.bindEvents();
      this.bindWindowData();
      this._bound = true;
    }

    this.readDataFromWindow();
    this.render();
  }

  disconnectedCallback() {
    clearTimeout(this._autoNextTimer);

    if (this._windowDataHandler) {
      window.removeEventListener('quiz-data-ready', this._windowDataHandler);
    }
  }

  set data(value) {
    this.applyData(value);
  }

  get data() {
    return this.config;
  }

  setData(value) {
    this.applyData(value);
  }

  applyData(value) {
    this.config = this.normalizeConfig(value);
    this.resetState();
    this.render();
  }

  attachStyles() {
    if (this._stylesAttached) return;

    if ('adoptedStyleSheets' in Document.prototype && sharedSheet) {
      this.shadowRoot.adoptedStyleSheets = [sharedSheet];
    } else {
      const style = document.createElement('style');
      style.textContent = cssText;
      this.shadowRoot.prepend(style);
    }

    this._stylesAttached = true;
  }

  bindWindowData() {
    this._windowDataHandler = () => {
      this.readDataFromWindow();
    };

    window.addEventListener('quiz-data-ready', this._windowDataHandler);
  }

  readDataFromWindow() {
    const rawData = window._quizData;

    if (!rawData || typeof rawData !== 'object') return;

    this.applyData(rawData);
  }

  normalizeConfig(raw) {
    if (!raw || typeof raw !== 'object') {
      return {
        launcher: null,
        intro: null,
        resultsTitle: 'Подобрали для вас',
        restartText: 'Попробовать снова',
        nextText: 'Продолжить',
        resultsLimit: 2,
        resultButton: {
          text: 'Смотреть подборку',
          url: ''
        },
        questions: [],
        results: []
      };
    }

    return {
      launcher: raw.launcher && typeof raw.launcher === 'object'
        ? {
          label: String(raw.launcher.label || '')
        }
        : null,

      intro: raw.intro && typeof raw.intro === 'object'
        ? {
          title: String(raw.intro.title || ''),
          text: String(raw.intro.text || ''),
          buttonText: String(raw.intro.buttonText || 'Начать'),
          image: String(raw.intro.image || '')
        }
        : null,

      resultsTitle: String(raw.resultsTitle || 'Подобрали для вас'),
      restartText: String(raw.restartText || 'Попробовать снова'),
      nextText: String(raw.nextText || 'Продолжить'),
      resultsLimit: Number(raw.resultsLimit) > 0 ? Number(raw.resultsLimit) : 2,

      resultButton:
        raw.resultButton && typeof raw.resultButton === 'object'
          ? {
            text: String(raw.resultButton.text || 'Смотреть подборку'),
            url: String(raw.resultButton.url || '')
          }
          : {
            text: 'Смотреть подборку',
            url: ''
          },

      questions: Array.isArray(raw.questions)
        ? raw.questions
          .map((question, questionIndex) => ({
            id: String(question?.id || `question-${questionIndex + 1}`),
            type: question?.type === 'multi' ? 'multi' : 'single',
            title: String(question?.title || ''),
            image: String(question?.image || ''),
            min:
              question?.type === 'multi' && Number(question?.min) > 0
                ? Number(question.min)
                : 1,
            options: Array.isArray(question?.options)
              ? question.options
                .map((option, optionIndex) => ({
                  id: String(
                    option?.id || `question-${questionIndex + 1}-option-${optionIndex + 1}`
                  ),
                  label: String(option?.label || ''),
                  value: option?.value ?? option?.id ?? option?.label ?? null,
                  country: String(option?.country || ''),
                  scores:
                    option?.scores && typeof option.scores === 'object'
                      ? Object.fromEntries(
                        Object.entries(option.scores).map(([key, value]) => [
                          String(key),
                          Number(value) || 0
                        ])
                      )
                      : {}
                }))
                .filter((option) => option.label)
              : []
          }))
          .filter((question) => question.title && question.options.length)
        : [],

      results: Array.isArray(raw.results)
        ? raw.results
          .map((result, resultIndex) => ({
            id: String(result?.id || `result-${resultIndex + 1}`),
            title: String(result?.title || ''),
            description: String(result?.description || ''),
            image: String(result?.image || ''),
            url: String(result?.url || ''),
            hash: String(result?.hash || ''),
            country: String(result?.country || result?.title || '')
          }))
          .filter((result) => result.title)
        : []
    };
  }

  resetState() {
    clearTimeout(this._autoNextTimer);
    this.currentStep = 0;
    this.answers = [];
    this.state = this.config?.intro ? 'intro' : 'question';
    this._finalClickInProgress = false;
  }

  bindEvents() {
    this.shadowRoot.addEventListener('click', (event) => {
      const actionEl = event.target.closest('[data-action]');
      if (!actionEl) return;

      const action = actionEl.dataset.action;
      const index =
        actionEl.dataset.index != null ? Number(actionEl.dataset.index) : null;

      switch (action) {
        case 'start':
          this.startQuiz();
          break;

        case 'prev':
          this.goPrev();
          break;

        case 'next':
          this.goNext();
          break;

        case 'select-single':
          if (Number.isInteger(index)) this.selectSingle(index);
          break;

        case 'toggle-multi':
          if (Number.isInteger(index)) this.toggleMulti(index);
          break;

        case 'restart':
          this.restart();
          break;

        case 'result-link':
          this.handleResultLinkClick(event, actionEl);
          break;

        default:
          break;
      }
    });
  }

  emit(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        detail
      })
    );
  }

  reachGoal(goal, params) {
    if (typeof window.ym !== 'function') return;

    if (params && typeof params === 'object') {
      window.ym(215233, 'reachGoal', goal, params);
      return;
    }

    window.ym(215233, 'reachGoal', goal);
  }

  getResultById(resultId) {
    return (this.config?.results || []).find((item) => item.id === resultId) || null;
  }

  getCountryByResultId(resultId) {
    const id = String(resultId || '').toLowerCase();

    if (id === 'egypt') return 'Египет';
    if (id === 'turkey') return 'Турция';

    const result = this.getResultById(resultId);
    if (!result) return '';

    const value = String(result.country || result.title || result.id || '').trim().toLowerCase();

    if (value.includes('егип')) return 'Египет';
    if (value.includes('turkey') || value.includes('турц')) return 'Турция';

    return '';
  }

  getCountryFromOption(option) {
    if (!option) return '';

    const rawCountry = String(option.country || '').trim().toLowerCase();

    if (rawCountry.includes('егип')) return 'Египет';
    if (rawCountry.includes('turkey') || rawCountry.includes('турц')) return 'Турция';

    const scoreEntries = Object.entries(option.scores || {});
    if (!scoreEntries.length) {
      const rawValue = String(option.value || option.label || '').trim().toLowerCase();

      if (rawValue.includes('егип')) return 'Египет';
      if (rawValue.includes('turkey') || rawValue.includes('турц')) return 'Турция';

      return '';
    }

    const matchedIds = scoreEntries
      .filter(([, score]) => Number(score) > 0)
      .map(([resultId]) => String(resultId).toLowerCase());

    if (matchedIds.includes('egypt')) return 'Египет';
    if (matchedIds.includes('turkey')) return 'Турция';

    scoreEntries.sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0));
    return this.getCountryByResultId(scoreEntries[0][0]);
  }

  getCountryForStep(stepIndex) {
    const question = this.config?.questions?.[stepIndex];
    const answer = this.answers?.[stepIndex];

    if (!question) return '';

    if (question.type === 'multi') {
      return this.getCountryParamForStep(stepIndex);
    }

    if (typeof answer === 'number') {
      const option = question.options?.[answer];
      return this.getCountryFromOption(option);
    }

    return '';
  }

  getCountriesForStep(stepIndex) {
    const question = this.config?.questions?.[stepIndex];
    const answer = this.answers?.[stepIndex];

    if (!question || question.type !== 'multi') return [];

    const selectedIndexes = Array.isArray(answer) ? answer : [];
    const countriesSet = new Set();

    selectedIndexes.forEach((optionIndex) => {
      const option = question.options?.[optionIndex];
      if (!option) return;

      const optionCountry = this.getCountryFromOption(option);
      if (optionCountry === 'Египет' || optionCountry === 'Турция') {
        countriesSet.add(optionCountry);
        return;
      }

      Object.entries(option.scores || {}).forEach(([resultId, score]) => {
        if (Number(score) <= 0) return;

        const country = this.getCountryByResultId(resultId);
        if (country === 'Египет' || country === 'Турция') {
          countriesSet.add(country);
        }
      });
    });

    return ['Египет', 'Турция'].filter((country) => countriesSet.has(country));
  }

  getCountryParamForStep(stepIndex) {
    const question = this.config?.questions?.[stepIndex];
    if (!question) return '';

    if (question.type === 'multi') {
      const countries = this.getCountriesForStep(stepIndex);
      return countries.join('|');
    }

    return this.getCountryForStep(stepIndex);
  }

  getFinalCountry() {
    const topResult = this.getRankedResults()?.[0] || null;
    if (!topResult) return '';

    return String(topResult.country || topResult.title || topResult.id || '');
  }

  trackQuizStart() {
    this.reachGoal('april_turkey_vs_egypt_quiz_start');
  }

  trackStepAnswer(stepIndex) {
    const stepNumber = Number(stepIndex) + 1;
    const country = this.getCountryParamForStep(stepIndex);

    console.log('quiz metric step', stepNumber, {country});

    if (!stepNumber || !country) return;

    this.reachGoal(`april_turkey_vs_egypt_quiz_${stepNumber}`, {
      country
    });
  }

  trackFinalClick(country) {
    const finalCountry = country || this.getFinalCountry();
    if (!finalCountry) return;

    this.reachGoal('april_turkey_vs_egypt_quiz_final', {
      country: finalCountry
    });
  }

  startQuiz() {
    if (!this.config?.questions?.length) return;

    this.trackQuizStart();

    this.state = 'question';
    this.currentStep = 0;
    this.answers = [];

    this.emit('quiz-start', {
      questions: this.config.questions
    });

    this.render();
  }

  goPrev() {
    clearTimeout(this._autoNextTimer);

    if (this.state === 'result') {
      this.state = 'question';
      this.currentStep = Math.max(this.config.questions.length - 1, 0);
      this.render();
      return;
    }

    if (this.currentStep > 0) {
      this.currentStep -= 1;

      this.emit('quiz-step', {
        step: this.currentStep
      });

      this.render();
      return;
    }

    if (this.currentStep === 0 && this.config?.intro) {
      this.state = 'intro';
      this.render();
    }
  }

  goNext() {
    const question = this.getCurrentQuestion();
    if (!question) return;
    if (!this.canGoNext(question)) return;

    if (question.type === 'multi') {
      this.trackStepAnswer(this.currentStep);
    }

    if (this.currentStep < this.config.questions.length - 1) {
      this.currentStep += 1;

      this.emit('quiz-step', {
        step: this.currentStep
      });

      this.render();
      return;
    }

    this.finishQuiz();
  }

  selectSingle(optionIndex) {
    const question = this.getCurrentQuestion();
    if (!question || question.type !== 'single') return;
    if (!question.options[optionIndex]) return;

    this.answers[this.currentStep] = optionIndex;

    this.emit('quiz-answer', {
      step: this.currentStep,
      questionId: question.id,
      type: 'single',
      selected: this.serializeStepAnswer(this.currentStep)
    });

    this.trackStepAnswer(this.currentStep);
    this.render();

    clearTimeout(this._autoNextTimer);
    this._autoNextTimer = setTimeout(() => {
      if (this.state === 'question' && this.getCurrentQuestion()?.type === 'single') {
        this.goNext();
      }
    }, 180);
  }

  toggleMulti(optionIndex) {
    const question = this.getCurrentQuestion();
    if (!question || question.type !== 'multi') return;
    if (!question.options[optionIndex]) return;

    const current = Array.isArray(this.answers[this.currentStep])
      ? [...this.answers[this.currentStep]]
      : [];

    const existingIndex = current.indexOf(optionIndex);

    if (existingIndex >= 0) {
      current.splice(existingIndex, 1);
    } else {
      current.push(optionIndex);
      current.sort((a, b) => a - b);
    }

    this.answers[this.currentStep] = current;

    this.emit('quiz-answer', {
      step: this.currentStep,
      questionId: question.id,
      type: 'multi',
      selected: this.serializeStepAnswer(this.currentStep)
    });

    this.render();
  }

  canGoNext(question) {
    const answer = this.answers[this.currentStep];

    if (question.type === 'multi') {
      const min = Number(question.min) > 0 ? Number(question.min) : 1;
      return Array.isArray(answer) && answer.length >= min;
    }

    return typeof answer === 'number';
  }

  finishQuiz() {
    const scoreMap = this.getScoreMap();
    const results = this.getRankedResults();

    this.state = 'result';

    this.emit('quiz-complete', {
      answers: this.serializeAnswers(),
      scoreMap,
      results
    });

    this.render();
  }

  restart() {
    this.resetState();

    this.emit('quiz-restart', {
      questions: this.config?.questions || []
    });

    this.render();
  }

  getCurrentQuestion() {
    return this.config?.questions?.[this.currentStep] || null;
  }

  getProgressPercent() {
    const total = this.config?.questions?.length || 0;
    if (!total) return 0;

    return Math.round(((this.currentStep + 1) / total) * 100);
  }

  getScoreMap() {
    const scoreMap = {};

    (this.config?.questions || []).forEach((question, questionIndex) => {
      const answer = this.answers[questionIndex];

      if (question.type === 'multi') {
        const selectedIndexes = Array.isArray(answer) ? answer : [];

        selectedIndexes.forEach((optionIndex) => {
          const option = question.options?.[optionIndex];
          if (!option) return;

          Object.entries(option.scores || {}).forEach(([resultId, score]) => {
            scoreMap[resultId] = (scoreMap[resultId] || 0) + (Number(score) || 0);
          });
        });

        return;
      }

      if (typeof answer === 'number') {
        const option = question.options?.[answer];
        if (!option) return;

        Object.entries(option.scores || {}).forEach(([resultId, score]) => {
          scoreMap[resultId] = (scoreMap[resultId] || 0) + (Number(score) || 0);
        });
      }
    });

    return scoreMap;
  }

  getRankedResults() {
    const scoreMap = this.getScoreMap();

    return (this.config?.results || [])
      .map((result) => ({
        ...result,
        score: scoreMap[result.id] || 0
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config?.resultsLimit || 2);
  }

  buildLinkWithHash(baseUrl, hash) {
    const url = String(baseUrl || '');
    const cleanHash = String(hash || '').replace(/^#/, '');

    if (!url && !cleanHash) return '';
    if (!url) return `#${cleanHash}`;
    if (!cleanHash) return url;

    return `${url}#${cleanHash}`;
  }

  handleResultLinkClick(event, linkEl) {
    const href = linkEl.getAttribute('href') || '';
    const country = String(linkEl.dataset.country || '');

    if (!href || this._finalClickInProgress) return;

    event.preventDefault();
    this._finalClickInProgress = true;

    this.trackFinalClick(country);

    setTimeout(() => {
      window.location.href = href;
    }, 120);
  }

  serializeStepAnswer(stepIndex) {
    const question = this.config?.questions?.[stepIndex];
    const answer = this.answers[stepIndex];

    if (!question) return null;

    if (question.type === 'multi') {
      return (Array.isArray(answer) ? answer : [])
        .map((index) => question.options?.[index])
        .filter(Boolean)
        .map((option) => ({
          id: option.id ?? null,
          label: option.label ?? null,
          value: option.value ?? null
        }));
    }

    const option = typeof answer === 'number' ? question.options?.[answer] : null;

    return {
      id: option?.id ?? null,
      label: option?.label ?? null,
      value: option?.value ?? null
    };
  }

  serializeAnswers() {
    return (this.config?.questions || []).map((question, questionIndex) => {
      const answer = this.answers[questionIndex];

      if (question.type === 'multi') {
        const selected = (Array.isArray(answer) ? answer : [])
          .map((index) => question.options?.[index])
          .filter(Boolean);

        return {
          questionId: question.id,
          question: question.title,
          type: 'multi',
          answerLabel: selected.map((item) => item.label),
          answerValue: selected.map((item) => item.value)
        };
      }

      const option = typeof answer === 'number' ? question.options?.[answer] : null;

      return {
        questionId: question.id,
        question: question.title,
        type: 'single',
        answerLabel: option?.label ?? null,
        answerValue: option?.value ?? null
      };
    });
  }

  pluralizeProducts(count) {
    const n = Math.abs(Number(count)) || 0;
    const n10 = n % 10;
    const n100 = n % 100;

    if (n10 === 1 && n100 !== 11) return `${n} товар`;
    if (n10 >= 2 && n10 <= 4 && !(n100 >= 12 && n100 <= 14)) return `${n} товара`;
    return `${n} товаров`;
  }

  render() {
    if (!this.config) {
      this.rootEl.innerHTML = `
        <div class="quiz-empty">
          Загрузка данных...
        </div>
      `;
      return;
    }

    if (!this.config.questions.length) {
      this.rootEl.innerHTML = `
        <div class="quiz-empty">
          Нет данных для квиза
        </div>
      `;
      return;
    }

    this.rootEl.innerHTML = this.renderMarkup();
  }

  renderMarkup() {
    if (this.state === 'intro' && this.config.intro) {
      return this.renderIntro();
    }

    if (this.state === 'result') {
      return this.renderResultScreen();
    }

    return this.renderQuestion();
  }

  renderIntro() {
    return `
      <div class="quiz">
        <div class="quiz__layout quiz__layout--split">
          <div class="quiz__panel quiz__panel--left">
            <div class="quiz__intro">
              <h2 class="quiz__title quiz__title--intro">
                ${this.escapeHtml(this.config.intro.title)}
              </h2>

              <p class="quiz__text">
                ${this.escapeHtml(this.config.intro.text)}
              </p>

              <div class="quiz__actions quiz__actions--center">
                <button type="button" class="quiz__btn" data-action="start">
                  ${this.escapeHtml(this.config.intro.buttonText)}
                </button>
              </div>
            </div>
          </div>

          <div class="quiz__panel quiz__panel--right">
            ${this.renderImage(this.config.intro.image, this.config.intro.title)}
          </div>
        </div>
      </div>
    `;
  }

  renderQuestion() {
    const question = this.getCurrentQuestion();
    const answer = this.answers[this.currentStep];
    const isMulti = question.type === 'multi';
    const progress = this.getProgressPercent();

    return `
      <div class="quiz quiz--question">
        <div class="quiz__layout quiz__layout--split">
          <div class="quiz__panel quiz__panel--left">
            <div class="quiz__question-wrap">
              <div class="quiz__top">
                <button
                  type="button"
                  class="quiz__icon-btn"
                  data-action="prev"
                  aria-label="Назад"
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 5L8 12L15 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </button>

                <div class="quiz__progress-wrap">
                  <div class="quiz__progress-text">
                    Подборка готова на ${progress}%
                  </div>

                  <div class="quiz__progress">
                    <div class="quiz__progress-bar" style="width:${progress}%"></div>
                  </div>
                </div>
              </div>

              <h3 class="quiz__title quiz__title--question">
                ${this.escapeHtml(question.title)}
              </h3>

              <div class="quiz__options">
                ${question.options
      .map((option, index) => {
        const isActive = isMulti
          ? Array.isArray(answer) && answer.includes(index)
          : answer === index;

        if (isMulti) {
          return `
                        <button
                          type="button"
                          class="quiz__option quiz__option--multi ${isActive ? 'is-active' : ''}"
                          data-action="toggle-multi"
                          data-index="${index}"
                        >
                          <span class="quiz__check" aria-hidden="true"></span>
                          <span class="quiz__option-label">
                            ${this.escapeHtml(option.label)}
                          </span>
                        </button>
                      `;
        }

        return `
                      <button
                        type="button"
                        class="quiz__option ${isActive ? 'is-active' : ''}"
                        data-action="select-single"
                        data-index="${index}"
                      >
                        ${this.escapeHtml(option.label)}
                      </button>
                    `;
      })
      .join('')}
              </div>

              ${
      isMulti
        ? `
                    <div class="quiz__actions quiz__actions--center">
                      <button
                        type="button"
                        class="quiz__btn"
                        data-action="next"
                        ${!this.canGoNext(question) ? 'disabled' : ''}
                      >
                        ${this.escapeHtml(this.config.nextText)}
                      </button>
                    </div>
                  `
        : ''
    }
            </div>
          </div>

          <div class="quiz__panel quiz__panel--right">
            ${this.renderImage(question.image, question.title)}
          </div>
        </div>
      </div>
    `;
  }

  renderResultScreen() {
    const results = this.getRankedResults();
    const count = results.length;
    const topResult = results[0] || null;

    const buttonUrl = this.buildLinkWithHash(
      this.config?.resultButton?.url || '',
      topResult?.hash || ''
    );

    return `
      <div class="quiz">
        <div class="quiz__layout quiz__layout--result">
          <div class="quiz__result-screen">
            <div class="quiz__result-head">
              <h2 class="quiz__title quiz__title--result">
                ${this.escapeHtml(this.config.resultsTitle)}
              </h2>

              <p class="quiz__result-sub">
                ${this.pluralizeProducts(count)}
              </p>
            </div>

            <div class="quiz__result-grid">
              ${results.map((item) => this.renderResultCard(item)).join('')}
            </div>

            <div class="quiz__result-footer">
              ${
      buttonUrl
        ? `
                    <a
                      class="quiz__btn quiz__btn--dark"
                      href="${this.escapeAttr(buttonUrl)}"
                      data-action="result-link"
                      data-country="${this.escapeAttr(topResult?.country || topResult?.title || '')}"
                    >
                      <span>${this.escapeHtml(this.config.resultButton.text)}</span>
                    </a>
                  `
        : `
                    <button
                      type="button"
                      class="quiz__btn quiz__btn--dark"
                      data-action="restart"
                    >
                      <span>${this.escapeHtml(this.config.restartText)}</span>
                    </button>
                  `
    }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderResultCard(item) {
    const link = this.buildLinkWithHash(item.url, item.hash);
    const tag = link ? 'a' : 'div';
    const href = link ? `href="${this.escapeAttr(link)}"` : '';
    const target = link ? `target="_self"` : '';
    const action = link ? 'data-action="result-link"' : '';
    const country = link ? `data-country="${this.escapeAttr(item.country || item.title || '')}"` : '';

    return `
      <${tag} class="quiz-card" ${href} ${target} ${action} ${country}>
        <div
          class="quiz-card__image"
          ${item.image ? `style="background-image:url('${this.escapeAttr(item.image)}')"` : ''}
        ></div>

        <div class="quiz-card__body">
          <div class="quiz-card__title">
            ${this.escapeHtml(item.title)}
          </div>

          <div class="quiz-card__text">
            ${this.escapeHtml(item.description || '')}
          </div>
        </div>
      </${tag}>
    `;
  }

  renderImage(src, altText = '') {
    if (!src) {
      return `
        <div class="quiz__image quiz__image--placeholder" aria-label="${this.escapeHtml(altText)}"></div>
      `;
    }

    return `
      <div
        class="quiz__image"
        role="img"
        aria-label="${this.escapeHtml(altText)}"
        style="background-image:url('${this.escapeAttr(src)}')"
      ></div>
    `;
  }

  escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  escapeAttr(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}

if (!customElements.get('quiz-widget')) {
  customElements.define('quiz-widget', QuizWidget);
}

if (!customElements.get('quiz-widget')) {
  customElements.define('quiz-widget', QuizWidget);
}
