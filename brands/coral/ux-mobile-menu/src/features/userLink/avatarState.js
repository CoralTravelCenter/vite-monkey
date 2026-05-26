export function createAvatarState(customLoginEl) {
    const unauthorized = customLoginEl?.querySelector(".unauthorized");
    let clonedAvatar = null;

    const removeCloned = () => {
        if (clonedAvatar?.parentNode) {
            clonedAvatar.parentNode.removeChild(clonedAvatar);
        }
        clonedAvatar = null;
    };

    const showUnauthorized = () => {
        unauthorized?.classList.remove("js-hidden");
        removeCloned();
    };

    const showAuthorized = (avatar) => {
        if (!avatar) return;

        unauthorized?.classList.add("js-hidden");
        removeCloned();

        clonedAvatar = avatar.cloneNode(true);
        customLoginEl.appendChild(clonedAvatar);
    };

    return {showUnauthorized, showAuthorized, removeCloned};
}
