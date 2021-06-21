import axios from 'axios'

export default {
    state: {
        status: localStorage.getItem('status') || '',
        token: localStorage.getItem('token') || '',
        loginDate: localStorage.getItem('loginDate') !== null ? new Date(JSON.parse(localStorage.getItem('loginDate'))) : null,
        user : localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null,
        authorities: localStorage.getItem('authorities') !== null ? JSON.parse(localStorage.getItem('authorities')) : {}
    },
    mutations: {
        auth_request(state){
            state.status = 'loading'
        },
        auth_success(state, {token, user}){
            state.status = 'success'
            state.token = token
            state.user = user
            state.loginDate = new Date()
            localStorage.setItem('token', state.token)
            localStorage.setItem('status', 'success')
            localStorage.setItem('user', JSON.stringify(state.user))
            localStorage.setItem('loginDate', JSON.stringify(state.loginDate))

            for(const authority of user.appRole.authorities){
                state.authorities[authority.name] = true;
            }
            localStorage.setItem('authorities', JSON.stringify(state.authorities))
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        },
        auth_error(state){
            localStorage.removeItem('loginDate')
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            localStorage.removeItem('authorities')
            state.user = null
            state.status = 'error'
            state.token = null
            delete axios.defaults.headers.common['Authorization']
        },
        logout(state){
            delete axios.defaults.headers.common['Authorization']
            state.status = ''
            state.token = ''
            state.loginDate = null
            state.user = null
            state.authorities = {}
            localStorage.removeItem('loginDate')
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            localStorage.setItem('status', '')
            localStorage.removeItem('authorities')
            localStorage.removeItem('authorizationCode')
            localStorage.removeItem('authorizationState')
            localStorage.removeItem('method')
        },
    },
    actions: {
        login({commit}, user){
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({
                    url: '/authentication/login',
                    data: user,
                    method: 'POST' })

                    .then(resp => {
                        const token = resp.data.jwttoken
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
                        //get current user
                        axios({
                            url: '/users/me',
                            method: 'get' })
                            .then(respUser=> {
                                let user = respUser.data
                                commit('auth_success', {token, user})
                                resolve(resp)
                            })
                            .catch(err=>{
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
        logout({commit}){
            return new Promise((resolve, reject) => {
                commit('logout')
                resolve()
            })
        },

        refreshToken({commit, state}){
            var method = localStorage.getItem('method')
            if(method != null && method == 'oauth2'){
                axios({
                    url: '/authentication/oauth2/refresh-token',
                    method: 'GET' })
                .then(resp => {
                    commit('auth_success', {token : resp.data.jwttoken, user : state.user})
                })
            }else{
                axios({
                    url: '/authentication/refresh-token',
                    method: 'GET' })
                .then(resp => {
                    const token = resp.data.jwttoken
                    const user = state.user
                    commit('auth_success', {token, user})
                    resolve(resp)
                })
            }
        }
    },
    getters : {
        isLoggedIn: state => !!state.user,
        authStatus: state => state.status,
    }
}
