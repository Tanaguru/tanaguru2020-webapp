import VueRouter from 'vue-router'
import axios from "axios";
import router from "@/router/index";
export default class TanaguruRouter extends VueRouter{
    constructor(routes, store) {
        super({
            routes,
            scrollBehavior(to, from, savedPosition) {
                return {x: 0, y: 0}
            }
        });
        this.store = store

        super.beforeEach((to, from, next) => {
            document.body.style.overflow = "auto"
            if(!this.store.state.tanaguruModules.loaded){
                this.store.dispatch('loadTanaguruModules').then(() => {
                    this.goToIfAuthorisation(to, next);
                })
            }else{
                this.goToIfAuthorisation(to, next);
            }
        })

        axios.interceptors.response.use(
            (res) => {
                return res;
            },
            (err)=>{
                if (err.response.status === 401) {
                    this.store.dispatch('logout')
                        .then(r => router.push('/'));
                } 
                else if (err.response.status === 403) {
                    router.push('/forbidden', () => {})
                }

                return Promise.reject(err.message);
            }
        );
    }

    goToIfAuthorisation(to, next){
        if(to.meta.requireAuthentication && !this.store.getters.isLoggedIn) {
            next({ name: 'Login', query: { from: to.path } });
        } else {
            if(this.checkAuthorisation(to)){
                next();
            }else{
                next({name: 'Forbidden'});
            }
        }
    }
    

    checkAuthorisation(to){
        let auth = (!to.meta.requireAuthentication || this.store.getters.isLoggedIn);
        let app_authority = (!to.meta.requireAuthority || this.store.state.auth.authorities[to.meta.requireAuthority]);
        let account_type = (!to.meta.requirePaidAccount || this.store.state.auth.user.appAccountType.name != 'FREE');

        return auth && app_authority && account_type;
    }
}
