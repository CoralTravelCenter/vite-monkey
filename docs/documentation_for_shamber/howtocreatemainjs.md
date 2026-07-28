Вот подробный `README.md`, который объясняет логику работы, разницу сред и правила создания виджетов для вашей CRM. Можешь сохранить его в корень своего проекта.

---

# Инструкция по разработке и интеграции виджетов для CRM

Данный репозиторий предназначен для сборки изолированных HTML/JS/CSS виджетов, которые встраиваются в CRM-систему (React-приложение).

Архитектура подразумевает две разные среды выполнения: **Dev (локальная разработка)** и **Build (продакшен для CRM)**. Из-за особенностей рендеринга React-приложений код инициализации виджета в этих средах отличается.

---

## 🛠 Разница сред выполнения (Dev vs Build)

| Характеристика | Dev-версия | Build-версия (CRM) |
| --- | --- | --- |
| **Среда запуска** | Локальный сервер Vite / инъекция через Tampermonkey. | Встроенный HTML-блок (`data-widget-type="1"`) внутри CRM. |
| **Контейнер** | `<div id="monkey-app"></div>` (искусственный контейнер). | `<div id="widget-ИМЯ_ПРОЕКТА"></div>` (создается при сборке). |
| **Ожидание DOM** | Обязательно через `await hostReactAppReady()`. | Не требуется (код выполняется синхронно). |
| **Причина** | React затирает и перерисовывает DOM при загрузке. Если вставить виджет сразу, React его удалит. | CRM отдает обертку виджета сразу в готовом HTML. В момент выполнения скрипта контейнер уже существует. |

---

## 💻 Среда разработки (Dev)

В режиме разработки мы имитируем работу внутри React-приложения, ожидая его полной загрузки.

**Пример `main.js` для Dev:**

```javascript
import { markup } from "./scripts/includeImages.js";
import './style.css';

// Ждем, пока React полностью построит DOM-дерево
await hostReactAppReady();

// Вставляем разметку в тестовый контейнер
document.getElementById('monkey-app').insertAdjacentHTML('afterbegin', markup);

```

---

## 📦 Среда продакшена (Build)

В боевой сборке виджет вставляется в CRM как статический кусок HTML. Ожидание загрузки React приведет к ошибке, так как функция `hostReactAppReady` может быть недоступна, а целевой контейнер уже отрендерен сервером.

**Пример `main.js` для Build:**

```javascript
import { markup } from "./scripts/includeImages.js";
import './style.css';

// Ищем уникальный контейнер текущего виджета
const container = document.getElementById('widget-china-cards');

// Безопасно вставляем разметку
if (container && !container.dataset.injected) {
    container.insertAdjacentHTML('afterbegin', markup);
    container.dataset.injected = 'true';
}

```

---

## 💡 Универсальный `main.js` (Best Practice)

Чтобы не переписывать файл `main.js` каждый раз перед сборкой, рекомендуется использовать универсальный скрипт. Он сам определит, в какой среде находится, и выполнит нужный код.

**Шаблон идеального `main.js`:**

```javascript
import { markup } from "./markup.html?raw";
import './style.css';

async function initWidget() {
    if (typeof hostReactAppReady === 'function') {
        await hostReactAppReady();
        const devContainer = document.getElementById('monkey-app');

        if (devContainer && !devContainer.dataset.injected) {
            devContainer.innerHTML = markup;
            devContainer.dataset.injected = 'true';
        }
        return;
    }
}
function onProdContainer() {
    const prodContainer = document.getElementById('block-name');

    if (prodContainer && !prodContainer.dataset.injected) {
        prodContainer.innerHTML = markup;
        prodContainer.dataset.injected = 'true';
    }
}

initWidget();
onProdContainer();

```

---

## ⚠️ Важные нюансы и правила составления скриптов

* **Уникальность ID:** Никогда не используй базовые идентификаторы вроде `id="app"`, `id="root"` или `id="container"` для боевого контейнера виджета. В CRM они уже заняты главным React-приложением. Использование дублей сломает верстку сайта.
* **Строгий нейминг:** Имя контейнера должно четко соответствовать имени, генерируемому сборщиком (например, `widget-название_проекта`). Опечатка даже в одной букве (например, `card` вместо `cards`) приведет к тому, что скрипт не найдет контейнер и виджет останется пустым.
* **Изоляция стилей:** Все классы в `style.css` должны иметь уникальный префикс, связанный с виджетом (например, `.china-cards-title`, а не просто `.title`). Иначе ваши стили переопределят глобальные стили CRM.
* **Отсутствие комментариев в итоговой верстке:** Сборщик Vite минифицирует код, но если вы правите HTML вручную, избегайте HTML-комментариев `<!-- -->` внутри боевого кода, чтобы не увеличивать вес страницы.
* **Защита от сбоев (`if (container)`):** Всегда проверяйте, найден ли целевой элемент в DOM, прежде чем использовать `insertAdjacentHTML` или `innerHTML`. Это защитит CRM от фатальных JS-ошибок (`Uncaught TypeError: Cannot read properties of null`), если кто-то случайно удалит обертку виджета.