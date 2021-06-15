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
                try{
                    let promise = axios.get(tanaguruModule + '/tanaguru-module.json')
                        .then(value => {
                            context.commit('onLoadModule', value.data)
                        })
                    modulePromises.push(promise)
                }catch (e) {
                    console.error("Could not load tanaguru module at " + tanaguruModule)
                }
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
        }
    }
}
