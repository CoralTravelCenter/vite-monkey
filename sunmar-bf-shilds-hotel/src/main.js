import './style.scss'
import {waitForDLEvent} from '../../utils.js'

const DL = await waitForDLEvent('view_item', 300)
const productId = DL?.ecommerce?.items[0].item_id
const detailWidget = document?.querySelector('#hotel-detail-area');
if (detailWidget) {
  detailWidget.setAttribute('data-hotel-id', productId)
}
