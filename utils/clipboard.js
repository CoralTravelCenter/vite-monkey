export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        throw new Error('copyToClipboard failed');
    }
}
