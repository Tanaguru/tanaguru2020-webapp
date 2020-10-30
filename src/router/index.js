import Vue from 'vue'
import store from '../store'
import Meta from 'vue-meta'
import TanaguruRouter from "@/router/TanaguruRouter";
import routes from "@/router/routes";
Vue.use(TanaguruRouter);
Vue.use(Meta);

export default new TanaguruRouter(routes, store)
