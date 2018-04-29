// only need to import bootstrap here for all components to have access to it
import 'firebaseui/dist/firebaseui.css'

import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueFire);

new Vue({
  el: '#app',
  render: h => h(App)
})
