import './style.css';

const LINK = document.querySelector('a[href*="hotel/?p=2"]')
LINK.addEventListener('click', (e) => {
  e.preventDefault();
  ym(96674199, "reachGoal", "entry-point", {
    name_stock: {
      '5_onlyhotel': {
        name_point: "main_page_hotels"
      }
    }
  })
  window.open(e.currentTarget.href, "_blank");
})
