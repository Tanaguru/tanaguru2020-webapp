import axios from 'axios'

export default {
    state: {
        appVersion: process.env.VERSION || '0',
        serverVersion: '0'
    },
    mutations: {
        version_error(state){
            state.serverVersion = '0'
        },
        version_success(state, {version}){
            state.serverVersion = version
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
                    console.log(error)
                    commit('version_error')
                })
        }
    },
    getters: {
        appVersion: (state) => {
            return state.appVersion
        },
        serverVersion: (state) => {
            return state.serverVersion
        }
    }
}
