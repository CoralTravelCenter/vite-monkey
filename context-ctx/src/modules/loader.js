export function showLoader() {
  if (document.querySelector(".travelloaderNewB2c")) return;

  const styles = `
		 <style>
        .travelloaderNewB2c{position:fixed;left:0;right:0;top:0;bottom:0;max-height:100%;max-width:100%;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;z-index:100001;background:rgba(0,0,0,.98);-webkit-animation:2.15s ease-in-out forwards darkness;animation:2.15s ease-in-out forwards darkness;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.travelloaderNewB2c.hide{display:none}@keyframes rotateAll{0%,70%{transform:rotate(0)}100%{transform:rotate(360deg)}}.travelloaderNewB2c .line-0{width:140px;height:19.992px;clip-path:circle(70px at 50% 70px);background:#f37c38;animation:3s cubic-bezier(.445,.05,.55,.95) infinite right-0;animation-delay:0s}@keyframes right-0{0%{transform:rotateX(0)}100%,70%{transform:rotateX(360deg)}}.travelloaderNewB2c .line-1{width:140px;height:16.996px;clip-path:circle(70px at 50% calc(70px - 19.992px));background:#fec984;animation:3s cubic-bezier(.445,.05,.55,.95) infinite right-1;animation-delay:.3s}@keyframes right-1{0%{transform:rotateX(0)}100%,70%{transform:rotateX(360deg)}}.travelloaderNewB2c .line-2{width:140px;height:21.994px;clip-path:circle(70px at 50% calc(70px - 36.988px));background:#fbb429;animation:3s cubic-bezier(.445,.05,.55,.95) infinite right-2;animation-delay:.6s}@keyframes right-2{0%{transform:rotateX(0)}100%,70%{transform:rotateX(360deg)}}.travelloaderNewB2c .line-3{width:140px;height:28.994px;clip-path:circle(70px at 50% calc(70px - 58.982px));background:#eb5b25;animation:3s cubic-bezier(.445,.05,.55,.95) infinite right-3;animation-delay:.9s}@keyframes right-3{0%{transform:rotateX(0)}100%,70%{transform:rotateX(360deg)}}.travelloaderNewB2c .line-4{width:140px;height:30.996px;clip-path:circle(70px at 50% calc(70px - 87.976px));background:#6ca7d9;animation:3s cubic-bezier(.445,.05,.55,.95) infinite right-4;animation-delay:1.2s}@keyframes right-4{0%{transform:rotateX(0)}100%,70%{transform:rotateX(360deg)}}.travelloaderNewB2c .line-5{width:140px;height:21px;clip-path:circle(70px at 50% calc(70px - 118.972px));background:#0a7ab1;animation:3s cubic-bezier(.445,.05,.55,.95) infinite right-5;animation-delay:1.5s}@keyframes right-5{0%{transform:rotateX(0)}100%,70%{transform:rotateX(360deg)}}@supports (-ms-ime-align:auto){.travelloaderNewB2c>.loader{border-radius:50%;overflow:hidden}}@media all and (-ms-high-contrast:none){.travelloaderNewB2c>.loader{border-radius:50%;overflow:hidden}.travelloaderNewB2c>.loader,::-ms-backdrop{border-radius:50%;overflow:hidden}}@keyframes multi-background{from{background-position:0 0,0 0,0 0,0 0,0 0}to{background-position:7800px 0,6500px 0,5200px 0,3900px 0,2600px 0}}@-webkit-keyframes darkness{0%{background:#000}100%{background:rgba(0,0,0,.5)}}@keyframes darkness{0%{background:#000}100%{background:rgba(0,0,0,.5)}}
        </style>
  `;
  document.head.insertAdjacentHTML("beforeend", styles);

  const loader = document.createElement("div");
  loader.className = "travelloaderNewB2c";
  loader.innerHTML = `
    <div class="loader">
      <div class="line-0"></div>
      <div class="line-1"></div>
      <div class="line-2"></div>
      <div class="line-3"></div>
      <div class="line-4"></div>
      <div class="line-5"></div>
    </div>
    <span style="display:none"></span>
  `;
  document.body.appendChild(loader);
}
