import axios from 'axios'

export default {
    state: {
        appVersion: process.env.VERSION || '0',
        serverVersion: '0',
        webextVersion: '0'
    },
    mutations: {
        version_error(state){
            state.serverVersion = '0'
        },
        version_success(state, {version}){
            state.serverVersion = version
        },
        webext_version_error(state){
            state.webextVersion = '0'
        },
        webext_version_success(state, {version}){
            state.webextVersion = version
        }
    },
    actions: {
        getServerVersion({commit}){
            axios({
                url: '/config/engine-version',
                method: 'GET' })
                .then(resp => {
                    let version = resp.data;
                    commit('version_success', {version})
                })
                .catch(error => {
                    console.error(error)
                    commit('version_error')
                })
        },
        getWebextVersion({commit}){
            axios({
                url: '/webextention/version',
                method: 'GET' })
                .then(resp => {
                    let version = resp.data;
                    commit('webext_version_success', {version})
                })
                .catch(error => {
                    console.error(error)
                    commit('webext_version_error')
                })
        }
    },
    getters: {
        appVersion: (state) => {
            return state.appVersion
        },
        serverVersion: (state) => {
            return state.serverVersion
        },
        webextVersion: (state) => {
            return state.webextVersion
        }
    }
}
