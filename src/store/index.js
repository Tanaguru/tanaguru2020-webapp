import Vue from 'vue'
import Vuex from 'vuex'
import auth from "@/store/auth";
import version from "@/store/version";
import activeTab from "@/store/activeTab"
import tanaguruModules from "@/store/tanaguru-modules"

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        auth: auth,
        version: version,
        activeTab: activeTab,
        tanaguruModules: tanaguruModules
    }
})

export default store
