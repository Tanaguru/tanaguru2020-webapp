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
            this.goToIfAuthorisation(to, next);
        })

        axios.interceptors.response.use(
            (res) => {
                return res;
            },
            (err)=>{
                if (err.response.status === 401) {
                    this.store.dispatch('logout')
                        .then(r => router.push('/'));
                } else if (err.response.status === 403) {
                    this.push('/forbidden')
                }
            }
        );
    }

    goToIfAuthorisation(to, next){
        if(this.checkAuthorisation(to)){
            next();
        }else{
            next({name: 'Forbidden'});
        }
    }

    checkAuthorisation(to){
        return  (!to.meta.requireAuthentication || this.store.getters.isLoggedIn) &&
            (!to.meta.requireAuthority || this.store.state.auth.auth.authorities[to.meta.requireAuthority]);
    }
}
