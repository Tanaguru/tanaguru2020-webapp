import Vue from './vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'


import VueAccessibleModal from "vue-accessible-modal";

// optional options
const options = {
    transition: 'fade',
}

Vue.use(VueAccessibleModal, options)

import VueHighlightJS from "vue-highlight.js";
import 'vue-highlight.js/lib/allLanguages'
import "highlight.js/styles/a11y-light.css";

Vue.use(VueHighlightJS);

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')