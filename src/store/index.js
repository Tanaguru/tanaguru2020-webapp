import Vue from 'vue'
import Vuex from 'vuex'
import auth from "@/store/auth";
import version from "@/store/version";
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        auth: auth,
        version: version
    }
})

export default store
