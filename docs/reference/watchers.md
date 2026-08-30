# Watchers

Реактивные watchers построены на RxJS. Для жизненного цикла DOM-элементов по CSS-селектору используется `selector-observer`.

## Как выбрать инструмент

| Задача                         | Инструмент                                  |
| ------------------------------ | ------------------------------------------- |
| Один раз дождаться элемента    | `waitForElement`                            |
| Следить за add/remove элемента | `reactDomObserver`                          |
| Один раз дождаться DOM-мутации | `waitForMutation`                           |
| Следить за мутациями узла      | `observeMutations$` внутри observation-слоя |
| Один раз дождаться viewport    | `waitForIntersection`                       |
| Следить за viewport            | `watchIntersection`                         |
| Слушать `dataLayer`            | `createDataLayerWatcher`                    |

Promise-функции являются адаптерами над общим RxJS observation-слоем. Они подходят для одноразового ожидания. Длительные процессы должны возвращать `Subscription` или другой явный способ остановки.

## Selector watcher

```js
import { reactDomObserver } from "@utils";

const observer = reactDomObserver();
const subscription = observer
  .observeSelector$(".hotel-card")
  .subscribe(({ type, element }) => {
    if (type === "add" || type === "initialize") {
      element.dataset.experimentReady = "true";
    }
  });

subscription.unsubscribe();
```

События:

- `initialize` — элемент уже существовал при старте;
- `add` — элемент добавлен;
- `remove` — элемент удалён.

## Одноразовое ожидание

```js
import { waitForElement } from "@utils";

const controller = new AbortController();
const popup = await waitForElement(".popup", {
  timeoutMs: 5000,
  signal: controller.signal,
});
```

`waitForMutation` и `waitForIntersection` поддерживают такой же timeout/AbortSignal lifecycle.

## DataLayer

```js
import { createDataLayerWatcher } from "@utils";
import { firstValueFrom } from "rxjs";

const watcher = createDataLayerWatcher();
const event = await firstValueFrom(watcher.event$("view_item"));
```

- `event$(name)` учитывает накопленную историю;
- `freshEvent$(name)` реагирует только на новые push;
- `destroy()` восстанавливает исходный `dataLayer.push`.

## Освобождение ресурсов

- завершай RxJS-подписки через `unsubscribe()`;
- используй AbortSignal для Promise-ожиданий;
- уничтожай watcher при завершении эксперимента;
- не создавай параллельную самописную реализацию, если observation-слой уже покрывает задачу.
