/* ——— Печенье судьбы · чистый JS, без фреймворков ——— */
(function () {
  'use strict'

  /* ——— Данные: 30 предсказаний (по 10 на страну) ——— */
  var COUNTRY_META = {
    china: { name: 'Китай', flag: '🇨🇳', tagline: 'Страна великих стен и туманных гор' },
    thailand: { name: 'Таиланд', flag: '🇹🇭', tagline: 'Страна улыбок и изумрудного моря' },
    vietnam: { name: 'Вьетнам', flag: '🇻🇳', tagline: 'Страна фонариков и бухт-драконов' },
  }

  var FORTUNES = [
    // ——— Китай ———
    { country: 'china', text: 'Великая стена ждёт твоих шагов — начни с первого.' },
    { country: 'china', text: 'Туман над горами Чжанцзяцзе скрывает твоё следующее приключение.' },
    { country: 'china', text: 'Чайная церемония в Китае откроет тебе новый вкус жизни.' },
    { country: 'china', text: 'Скоро ты увидишь панд — и улыбнёшься шире, чем когда-либо.' },
    { country: 'china', text: 'Путь в тысячу ли начинается с одного клика на тур.' },
    { country: 'china', text: 'Запретный город уже приоткрывает для тебя свои ворота.' },
    { country: 'china', text: 'Твоё сердце найдёт покой в садах Сучжоу.' },
    { country: 'china', text: 'Рассвет на рисовых террасах Лунцзи стоит любого будильника.' },
    { country: 'china', text: 'В неоновом Шанхае тебя ждёт вечер, который запомнится надолго.' },
    { country: 'china', text: 'Древняя мудрость гласит: твоя дорога ведёт на Восток.' },
    // ——— Таиланд ———
    { country: 'thailand', text: 'Улыбка Таиланда найдёт тебя раньше, чем ты её.' },
    { country: 'thailand', text: 'Тёплый песок Пхукета уже помнит форму твоих следов.' },
    { country: 'thailand', text: 'Храм на рассвете подарит тебе тишину, которой нет в городе.' },
    { country: 'thailand', text: 'Манго с липким рисом в Бангкоке станет твоим новым счастьем.' },
    { country: 'thailand', text: 'Длиннохвостая лодка ждёт, чтобы показать тебе скрытую лагуну.' },
    { country: 'thailand', text: 'Слон в Чиангмае посмотрит на тебя как на старого друга.' },
    { country: 'thailand', text: 'Ночной рынок откроет тебе тысячу новых ароматов.' },
    { country: 'thailand', text: 'Твоё море — изумрудное, и оно уже нагревается.' },
    { country: 'thailand', text: 'Закат на Пхи-Пхи будет именно таким, как в твоих мечтах.' },
    { country: 'thailand', text: 'Савади, путешественник! Твой отпуск уже машет тебе рукой.' },
    // ——— Вьетнам ———
    { country: 'vietnam', text: 'Бухта Халонг хранит для тебя рассвет среди островов.' },
    { country: 'vietnam', text: 'Фонарики Хойана зажгутся и в твоём путешествии.' },
    { country: 'vietnam', text: 'Кофе со сгущёнкой в Ханое изменит твоё утро навсегда.' },
    { country: 'vietnam', text: 'Твоя история уже на борту лодки в дельте Меконга.' },
    { country: 'vietnam', text: 'Террасы Сапы напомнят: красота растёт на терпении.' },
    { country: 'vietnam', text: 'Вьетнамское «син чао» прозвучит для тебя как приглашение домой.' },
    { country: 'vietnam', text: 'Пещеры Фонгня ждут исследователя — и это ты.' },
    { country: 'vietnam', text: 'Миска фо на рассвете согреет сильнее любого одеяла.' },
    { country: 'vietnam', text: 'Твой путь лежит через перевал Хайван — и вид оттуда твой.' },
    { country: 'vietnam', text: 'Улицы Хошимина научат тебя ритму, под который хочется жить.' },
  ]

  /* ——— Лепестки сакуры ——— */
  var petalsBox = document.getElementById('petals')
  for (var i = 0; i < 14; i++) {
    var p = document.createElement('span')
    p.className = 'petal'
    p.style.left = ((i * 71 + 13) % 100) + '%'
    var size = 10 + ((i * 37) % 14)
    p.style.width = size + 'px'
    p.style.height = size + 'px'
    p.style.opacity = String(0.35 + ((i * 17) % 40) / 100)
    var duration = 9 + ((i * 1.9) % 7)
    var delay = -((i * 2.7) % 14)
    p.style.animationDuration = duration + 's, ' + duration / 2 + 's'
    p.style.animationDelay = delay + 's, ' + delay + 's'
    p.style.setProperty('--sway', 18 + ((i * 23) % 26) + 'px')
    petalsBox.appendChild(p)
  }

  /* ——— Игровая логика ——— */
  var stage = document.getElementById('stage')
  var cookieStage = document.getElementById('cookieStage')
  var cookieBtn = document.getElementById('cookieBtn')
  var hint = document.getElementById('hint')
  var card = document.getElementById('fortuneCard')
  var fortuneText = document.getElementById('fortuneText')
  var countryFlag = document.getElementById('countryFlag')
  var countryName = document.getElementById('countryName')
  var countryTagline = document.getElementById('countryTagline')
  var againBtn = document.getElementById('againBtn')

  var phase = 'idle' // idle | cracking | revealed
  var lastIdx = -1
  var timer = null

  function setPhase(next) {
    phase = next
    stage.className = 'stage ' + next
    cookieStage.className = 'cookie-stage ' + next
  }

  function pickFortune() {
    var i = Math.floor(Math.random() * FORTUNES.length)
    while (i === lastIdx) {
      i = Math.floor(Math.random() * FORTUNES.length)
    }
    lastIdx = i
    return FORTUNES[i]
  }

  function crack() {
    if (phase !== 'idle') return
    var fortune = pickFortune()
    var meta = COUNTRY_META[fortune.country]

    fortuneText.textContent = '«' + fortune.text + '»'
    countryFlag.textContent = meta.flag
    countryName.textContent = meta.name
    countryTagline.textContent = meta.tagline
    card.className = 'fortune-card ' + fortune.country

    setPhase('cracking')
    cookieBtn.disabled = true
    hint.style.display = 'none'

    timer = setTimeout(function () {
      setPhase('revealed')
      card.hidden = false
    }, 1000)
  }

  function again() {
    if (timer) clearTimeout(timer)
    card.hidden = true
    cookieBtn.disabled = false
    hint.style.display = ''
    setPhase('idle')
  }

  cookieBtn.addEventListener('click', crack)
  againBtn.addEventListener('click', again)
})()
