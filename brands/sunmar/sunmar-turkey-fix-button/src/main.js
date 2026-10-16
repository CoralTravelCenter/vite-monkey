import { waitForElement } from "@utils";

;(async function waitTurkeysButton() {
    try {
        let btn = await waitForElement('.sunmar-button');
        const targetBlock = await waitForElement('.offre-vue');

        if (btn && targetBlock) {
            const clone = btn.cloneNode(true);
            btn.replaceWith(clone);
            btn = clone;

            btn.removeAttribute('href');
            btn.removeAttribute('data-lookup-destination');
            btn.style.cursor = 'pointer';

            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                targetBlock.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    } catch {}
})();