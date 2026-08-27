import markup from './markup.html?raw';
import './style.css';
import { mediaMatcher } from '@utils';

function render(hostSelector, point) {
    const host = document.querySelector(hostSelector);

    if (!host) return;

    host.insertAdjacentHTML('beforeend', markup);

    ym(96674199, 'reachGoal', 'entry-point', {
        name_stock: {
            ny_normal_27: {
                name_point: point,
            },
        },
    });
}

mediaMatcher(993, (isDesktop) => {
    if (document.getElementById('ny-2026-bubble')) return;

    isDesktop
        ? render('div[class*="HeaderTopBar_iconContainer__"]', 'PC')
        : render('div[class*="HeaderMobile_rightGroup__"]', 'mobile');
});


