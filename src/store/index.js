import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    user : null,
    authorities : {},
    tryRecoverSession: false,
    teamModal: false
  },
  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, user){
      state.user = user;
      for(var authority of user.appRole.authorities){
        state.authorities[authority.name] = true;
      }
      state.status = 'success';
    },
    auth_error(state){
      state.status = 'error';
    },
    recover_success(state, user){
      state.user = user;
      for(var authority of user.appRole.authorities){
        state.authorities[authority.name] = true;
      }
      state.status = 'success';
      state.tryRecoverSession = true;
    },
    recover_failed(state){
      state.tryRecoverSession = true;
    },
    logout(state){
      state.status = '';
      state.user = null;
      state.authorities = {};
    },
  },
  actions: {
    login({commit}, authData){
      var formData = new FormData();
      formData.set("username", authData.username);
      formData.set("password", authData.password);

      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({
          url: '/authentication', data: formData,
          method: 'POST',
          headers: {'Content-Type': 'multipart/form-data' }
        })
        .then(resp => {
          axios({
            url: '/users/me',
            method: 'GET'
          })
          .then(userResp => {
            resolve(resp)
            commit('auth_success', userResp.data)
          })
          .catch(err => {
            commit('auth_error')
            reject(err)
          })

        })
        .catch(err => {
          commit('auth_error')
          reject(err)
        })
      })
    },
    recoverSession({commit}){
      return new Promise((resolve, reject) => {
        axios({
          url: '/users/me',
          method: 'GET'
        })
        .then(userResp => {
          commit('recover_success', userResp.data);
          resolve();
        })
        .catch(err => {
          commit('recover_failed');
          reject(err);
        })
      })
    },
    resetSession({commit}){
      return new Promise((resolve, reject) => {
        commit('logout')
        resolve()
      })
    },
    logout({commit}){
      return new Promise((resolve, reject) => {
        axios({
          url: '/logout',
          method: 'GET',
        })
        .then(resp => {
          commit('logout')
          resolve()
        })
      })
    }
  },
  modules: {
  },
  getters:{
    isLoggedIn: state => !!state.user,
    authStatus: state => state.status,
  },
})
