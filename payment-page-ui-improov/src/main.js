import './style.css'
import {SimpleReactDomObserver} from "../../utils.js";

new SimpleReactDomObserver('.payment-pay', {
    onAppear: element => {
        console.log(element)
        const payBtn = element.querySelector('.pay');
        const place = document.querySelector('.product-summary');
        const clone = element.cloneNode(true);

        const clonedPayBtn = clone.querySelector('button')
        clonedPayBtn.className = 'ab-test-btn ant-btn css-1dzkrh8 ant-btn-primary ant-btn-color-primary ant-btn-variant-solid ant-btn-lg text-bold'
        clonedPayBtn.addEventListener('click', () => {
            payBtn.click();
        })
        clone.setAttribute('data-ui', 'true')
        place.append(clone);
    }
}).start()