import {ReactDomObserver} from "../../utils.js";

console.log('he')

new ReactDomObserver('.virtuoso-item-list', {
  childList: true,
  onAppear: (el) => {
    console.log(el)
  },
  onChildMutate: (el) => {
    console.log(el)
  }
})
