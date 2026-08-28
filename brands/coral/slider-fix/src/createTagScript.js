export function createTagScript(url) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;
    return script;
}