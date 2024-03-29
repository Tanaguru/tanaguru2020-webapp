import axios from 'axios'

export default {
    state: {
        modules: [],
        loaded: false
    },
    mutations: {
        onLoadModule(state, module){
            state.modules.push(module)
        }
    },
    actions: {
        loadTanaguruModules(context){
            let modulePromises = []
            for(const tanaguruModule of TANAGURU_MODULES){
                let promise = axios.get(tanaguruModule + '/tanaguru-module.json')
                    .then(value => {
                        context.commit('onLoadModule', value.data)
                    })
                    .catch( err => console.error("Could not load tanaguru module at " + tanaguruModule))
                    modulePromises.push(promise)
            }
            return Promise.all(modulePromises)
                .then(values => {
                    context.state.loaded = true
                })
        }
    },
    getters: {
        getModuleByName: (state) => (name) => {
            return state.modules.find(module => {
                return module.name === name;
            })
        },
        getOnlineModules: (state) => {
            return state.modules.filter(module => {
                return module.showOnline
            })
        },
        getOfflineModules: (state) => {
            return state.modules.filter(module => {
                return module.showOffline
            })
        },
        getHomeModule: (state) => {
            return state.modules.find(module => {
                return module.home == true;
            })
        }
    }
}
