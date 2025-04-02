function lazyAction(swiper, slidesPerView = 1) {
  const activeIndex = swiper.activeIndex;
  const slidesArr = swiper.slides;

  // Получаем индексы слайдов, которые нужно загрузить
  const indicesToLoad = Array.from(
    {length: slidesPerView},
    (_, i) => activeIndex + i
  );

  indicesToLoad.forEach(index => {
    if (index >= 0 && index < slidesArr.length) {
      const slide = slidesArr[index];

      // Находим все изображения внутри текущего слайда
      const images = slide.querySelectorAll('img[data-src]');

      images.forEach(image => {
        if (image && image.hasAttribute('data-src')) {
          image.src = image.getAttribute('data-src');  // Загружаем картинку
          image.style.visibility = 'visible';
          image.classList.remove('lazy-image');
          image.removeAttribute('data-src');  // Убираем data-src после загрузки
        }
      });
    }
  });
}

function payAttentionInit() {
  const SETTINGS = window._pay_attention_slider
  const pay_attention_slider = document.querySelector("[data-pay-attention-slider]");
  const fragment = document.createDocumentFragment();
	const selector = 'section.pay-attention'

  function generateMarkup(el) {
    const slide = document.createElement("swiper-slide");
    const container = document.createElement("div");
    container.classList.add("content-wrapper");

    const visual = document.createElement("div");
    const image = document.createElement('img');
    image.setAttribute('data-src', el.visual)
    image.classList.add('lazy-image');
    // image.alt = cleanText(el.content.headline);
    image.width = '262'
    image.height = '186'
    visual.classList.add("visual");
    visual.append(image);

    const content = document.createElement("div");
    content.classList.add('content');
    const h3 = document.createElement("h3");
    h3.innerHTML = el.content.headline
    h3.style.color = el.content.color
    content.append(h3);

    let text = null
    if (el.content.text !== '') {
      text = document.createElement('p')
      text.innerHTML = el.content.text
      text.style.color = el.content.color
      content.append(text);
    }

    const link = document.createElement("a");
    link.classList.add('coral-main-btn', 'white');
    link.href = el.action.url
    link.innerHTML = el.action.title
    link.target = '_blank'

    content.append(link);
    container.append(content, visual);

    slide.append(container);
    fragment.append(slide);
  }

  SETTINGS.forEach(el => generateMarkup(el));
  pay_attention_slider.append(fragment)

  const params =  {
    spaceBetween: 16,
    loop: false,
		slidesPerView: 4,
		navigation: {
      prevEl: `${selector} .slider-bnt-prev`,
      nextEl: `${selector} .slider-bnt-next`,
    },
		pagination: {
      clickable: true,
    },
		on: {
      init: swiper => lazyAction(swiper, 4),
      slideChange: swiper => lazyAction(swiper, 4),
    }
  }
  Object.assign(pay_attention_slider, params)
  pay_attention_slider.initialize()
}

if (!window.location.origin.includes('backoffice')) payAttentionInit()
