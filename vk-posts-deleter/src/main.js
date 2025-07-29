import {waiteSelector} from "../../utils.js";

let customButton = null;

// === ⚙️ ПАРАМЕТРЫ СКОРОСТИ УДАЛЕНИЯ ===
const DELETE_MENU_DELAY = 100;   // пауза после открытия меню (мс)
const CONFIRM_DELAY = 200;   // пауза после подтверждения удаления (мс)
const BETWEEN_POSTS = 100;   // пауза между постами (мс)

async function scrollToBottom() {
  return new Promise((resolve) => {
    let lastHeight = 0;
    const interval = setInterval(() => {
      window.scrollBy(0, 1000);
      if (document.body.scrollHeight !== lastHeight) {
        lastHeight = document.body.scrollHeight;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });
}

async function openPostMenu(post) {
  const menuBtn = post.querySelector('[data-testid="post_context_menu_toggle"]');
  if (!menuBtn) {
    console.warn('❌ Меню не найдено');
    return false;
  }

  menuBtn.click();
  await new Promise((r) => setTimeout(r, DELETE_MENU_DELAY));
  return true;
}

function waitForDeleteButton(timeout = 2000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const btn = document.querySelector('[data-testid="post_context_menu_item_delete"]');
      if (btn) return resolve(btn);
      if (Date.now() - start > timeout) return resolve(null);
      setTimeout(check, 100);
    };
    check();
  });
}

function waitForConfirmButton(timeout = 2000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const btn = document.querySelector('[class*="Button"][class*="primary"]:not([disabled])');
      if (btn) return resolve(btn);
      if (Date.now() - start > timeout) return resolve(null);
      setTimeout(check, 100);
    };
    check();
  });
}

waiteSelector('#narrow_column').then(() => {
  customButton = document.createElement("button");
  customButton.textContent = "Удалить до 100 постов";
  Object.assign(customButton.style, {
    width: '100%',
    padding: '1rem',
    marginTop: '1rem',
    cursor: 'pointer',
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px'
  });
  const placeForButton = document.querySelector('#narrow_column');
  placeForButton.append(customButton);
});

waiteSelector('.feed_wall--no-islands').then(() => {
  customButton.addEventListener("click", () => {
    (async () => {
      console.log(`🔄 Прокрутка...`);
      await scrollToBottom();

      let deleted = 0;
      const posts = Array.from(document.querySelectorAll('._post')).filter(
        post => post.offsetParent !== null
      ).slice(0, 100);

      console.log(`📦 К удалению: ${posts.length} постов`);

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        console.log(`🗑 Удаление поста #${i + 1}`);

        const opened = await openPostMenu(post);
        if (!opened) continue;

        const deleteBtn = await waitForDeleteButton();
        if (!deleteBtn) {
          console.warn(`⚠️ Кнопка "Удалить" не найдена`);
          continue;
        }

        deleteBtn.click();
        await new Promise((r) => setTimeout(r, DELETE_MENU_DELAY));

        const confirm = await waitForConfirmButton();
        if (confirm) {
          confirm.click();
          deleted++;
          console.log(`✅ Пост #${i + 1} удалён`);
          await new Promise((r) => setTimeout(r, CONFIRM_DELAY));
        } else {
          console.warn(`⚠️ Подтверждение удаления не найдено`);
        }

        await new Promise((r) => setTimeout(r, BETWEEN_POSTS));
      }

      alert(`🧹 Готово. Удалено постов: ${posts.length}`);
    })();
  });
});
