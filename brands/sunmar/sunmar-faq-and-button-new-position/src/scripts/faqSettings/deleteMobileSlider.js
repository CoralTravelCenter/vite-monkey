export function deleteMobileSlider() {
    const slider = document.querySelector('[class*="SwiperContainer_glider_glideContainer__"]');
    if (!slider) {return;}
    slider.style.display = 'none';
}