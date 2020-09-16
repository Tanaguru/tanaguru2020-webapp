import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'

import Home from '../views/Home.vue'
import Login from '../views/Login'
import Admin from '../views/Admin'
import Config from '../views/Configuration'

import UserDetail from '../views/UserDetail'
import ContractDetail from '../views/ContractDetail'
import ProjectDetail from '../views/ProjectDetail'
import AuditLaunch from '../views/AuditLaunch/AuditLaunch'
import AuditDetail from '../views/AuditDetail/AuditDetail'
import PageDetail from '../views/PageDetail/PageDetail'
import Archives from '../views/Archives'
import AuditHistory from '../views/AuditHistory'
import ResetPassword from "../views/ResetPassword";
import ForgotPassword from "../views/ForgotPassword";

import Forbidden from '../views/Forbidden'
import NotFound from '../views/NotFound'

Vue.use(VueRouter);
Vue.use(Meta);

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },{
    path: '/login',
    name: 'Login',
    component: Login
  },{
    path: '/forbidden',
    name: 'Forbidden',
    component: Forbidden
  },{
    path: '/users/:id',
    name: 'UserDetail',
    component: UserDetail,
    meta :{
      requireAuthentication : true
    }
  },{
    path: '/contracts/:id',
    name: 'ContractDetail',
    component: ContractDetail,
    meta :{
      requireAuthentication : true
    }
  },{
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: ProjectDetail,
    meta :{
      requireAuthentication : true
    }
  },{
    path: '/projects/:id/audit',
    name: 'AuditLaunch',
    component: AuditLaunch,
    meta :{
      requireAuthentication : true
    }
  },{
    path: '/audits/:id/:sharecode?',
    name: 'AuditDetail',
    component: AuditDetail,
    meta :{
      requireAuthentication : true
    }
  },{
    path: '/audits/:auditId/pages/:pageId/history',
    name: 'AuditHistory',
    component: AuditHistory,
    meta :{
      requireAuthentication : true
    }
  },{
    path: '/audits/:auditId/pages/:pageId/:sharecode?',
    name: 'PageDetail',
    component: PageDetail,
  },{
    path: '/administration',
    name: 'Admin',
    component: Admin,
    meta :{
      requireAuthentication : true,
      requireAuthority : 'SHOW_USER',
    }
  },{
    path: '/configuration',
    name: 'Config',
    component: Config,
    meta :{
      requireAuthentication : true,
    }
  },{
    path: '/projects/:id/archives',
    name: 'Archives',
    component: Archives,
    meta :{
      requireAuthentication : true,
    }
  },{
    path: '/reset-password/:userId/:token',
    name: 'ResetPassword',
    component: ResetPassword,
  },{
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    },{
    path: "/404",
    name: 'NotFound',
    component: NotFound
  },{
    // catch all 404 - define at the very end
    path: '*',
    redirect: '/404'
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if(
    !store.getters.isLoggedIn &&
    !store.state.tryRecoverSession){

    store.dispatch('recoverSession')
    .then(
      () =>{
        goToIfAuthorisation(to, next);
      }
    ).catch(err => {
      goToIfAuthorisation(to, next);
    });
  }else{

    goToIfAuthorisation(to, next);
  }
})

function goToIfAuthorisation(to, next){
  if(checkAuthorisation(to)){
    next();
  }else{
    next({name: 'Forbidden'});
  }
}

function checkAuthorisation(to){
  var checkAuthorisation = (!to.meta.requireAuthentication || store.getters.isLoggedIn) &&
    (!to.meta.requireAuthority || store.state.authorities[to.meta.requireAuthority]);
    return checkAuthorisation;
}

export default router
