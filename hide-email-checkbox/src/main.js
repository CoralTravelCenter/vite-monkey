import {SimpleReactDomObserver} from "../../utils.js";
import './style.css';

new SimpleReactDomObserver('div[class*="ManageSubscriptionsForm"]', {
  onAppear: (el) => {
    if (!el) return;

    const labelTitle = el?.querySelector('.ant-checkbox-label');
    const label = labelTitle && labelTitle.closest('label');
    const targetContainer = label && label?.closest('.ant-col');
    const isInfoDistribution = targetContainer && targetContainer.previousElementSibling?.querySelector('span[class*="SubscriptionTypeCard_title"]');

    if (isInfoDistribution.textContent === 'Информационная рассылка') {
      const disabledRow = targetContainer.closest('.ant-row');
      disabledRow && disabledRow.setAttribute('data-disabled', 'true')
    }
  }
}).start()
