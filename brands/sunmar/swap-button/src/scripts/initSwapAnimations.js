export function initSwapAnimation() {
    setInterval(() => {
        const swapButtons = document.querySelectorAll('.swap-button');

        if (swapButtons.length > 0) {
            swapButtons.forEach((button) => {
                button.classList.toggle('is-swapped');
            });
        }
    }, 2000);
}