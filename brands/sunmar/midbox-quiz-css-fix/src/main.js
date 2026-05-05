import css from './style.css?inline';
import {ReactDomObserver} from '../../utils.js';

function injectStyles(shadow) {
    if (shadow.__customStyleInjected) return;

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, sheet];
    shadow.__customStyleInjected = true;
}

function bindTriggerMetric(shadow) {
    const trigger = shadow.querySelector('.go2693040066');
    if (!trigger || trigger.__metricBound) return;

    trigger.addEventListener('click', () => {
        ym(215233, 'reachGoal', 'entry_point', {
            name_stock: {
                april_turkey_vs_egypt: {
                    name_point: 'quiz',
                },
            },
        });
    });

    trigger.__metricBound = true;
}

function initVisibilityObserver(host) {
    if (host.__visibilityObserverInited) return;

    host.__visibilityObserverInited = true;

    const observer = new ReactDomObserver(
        ['.ant-modal-root', '.HeaderHamburgerMenu_menuContainer__wSVvc'],
        {
            mode: 'any',
            onAppear: () => {
                host.style.setProperty('display', 'none', 'important');
            },
            onDisappear: () => {
                host.style.setProperty('display', 'block', 'important');
            },
        }
    );

    observer.start();
    host.__visibilityObserver = observer;
}

new ReactDomObserver('#qz-container', {
    once: true,
    onAppear: (host) => {
        const shadow = host.shadowRoot;
        if (!shadow) return;

        injectStyles(shadow);
        bindTriggerMetric(shadow);
        initVisibilityObserver(host);
    },
}).start();


