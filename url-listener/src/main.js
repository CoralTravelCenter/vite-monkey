// (() => {
//   // защита от повторного патча
//   if (window.__urlChangePatched) return
//   window.__urlChangePatched = true
//
//   let prevUrl = location.href
//
//   const fire = (from) => {
//     const url = location.href
//     if (url === prevUrl) return
//     const fromUrl = prevUrl
//     prevUrl = url
//
//     window.dispatchEvent(
//       new CustomEvent('urlchange', {
//         detail: {url, from, fromUrl},
//       }),
//     )
//   }
//
//   const {pushState, replaceState} = history
//
//   history.pushState = function (...args) {
//     const r = pushState.apply(history, args)
//     fire('pushState')
//     return r
//   }
//
//   history.replaceState = function (...args) {
//     const r = replaceState.apply(history, args)
//     fire('replaceState')
//     return r
//   }
//
//   window.addEventListener('popstate', () => fire('popstate'))
// })()

(async () => {
  async function catchRedirect(matchList = []) {
    return new Promise((resolve) => {
      const handler = (e) => {
        const url = e?.detail?.url
        if (!url) return resolve(false)
        const path = new URL(url).pathname
        resolve(matchList.some((s) => path.startsWith(s)))
      }
      window.addEventListener('urlchange', handler, {once: true})
    })
  }

  await catchRedirect(['/hotels/', '/packagetours/', '/onlyhotel/',])
  window.__urlChangePatched = true;
})()
