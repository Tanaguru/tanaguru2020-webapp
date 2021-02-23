import Vue from 'vue'
import Vuex from 'vuex'
import auth from "@/store/auth";
import version from "@/store/version";
import activeTab from "@/store/activeTab"
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        auth: auth,
        version: version,
        activeTab: activeTab
    }
})

export default store
