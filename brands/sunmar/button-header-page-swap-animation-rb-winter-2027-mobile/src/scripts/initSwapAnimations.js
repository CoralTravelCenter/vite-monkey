const SWAP_INTERVAL_MS = 2000;
let animationIntervalId = null;
let isSwapped = false;

export function initSwapAnimation() {
    if (animationIntervalId !== null) {
        return;
    }

    animationIntervalId = window.setInterval(() => {
        isSwapped = !isSwapped;
        document.querySelectorAll('.button-header-page-swap-animation-rb-winter-2027-mobile').forEach((button) => {
            button.classList.toggle('is-swapped', isSwapped);
        });
    }, SWAP_INTERVAL_MS);
}
