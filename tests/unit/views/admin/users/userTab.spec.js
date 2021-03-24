import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../../helper/localVueHelper";
import i18n from "@/i18n";
import Vuex from "vuex";
import UserTab from "@/views/Admin/User/UserTab";
import UserCreationForm from "@/components/users/UserCreationForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()
const NO_AUTHORITY_STORE = new Vuex.Store({
    state : {
        auth : {
            user : {
                appRole: {
                    name: 'TEST'
                }
            }
        }
    }
})
const CREATE_USER_STORE = new Vuex.Store({
    state : {
        auth : {
            authorities : {
                CREATE_USER: true
            },
            user : {
                appRole: {
                    name: 'TEST'
                }
            }
        }
    }
})

const EMPTY_USER_LIST = {
    content: [],
    totalPages:0,
    totalElements:0
}

const NOT_EMPTY_USER_LIST = {
    content : [
        {
            username: 'admin',
            email: 'admin@test.com'
        },
        {
            username: 'test',
            email: 'test@test.com'
        }
    ],
    totalPages:1,
    totalElements:2
}

const FILTER_USER_LIST = {
    content : [
        {
            username: 'admin',
            email: 'admin@test.com'
        }
    ],
    totalPages:1,
    totalElements:1
}

describe('UserTab', () => {
    describe('User creation form', () => {
        it('should hide if user does not have authority to create user', () => {
            const wrapper = shallowMount(UserTab, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    users: NOT_EMPTY_USER_LIST
                },
                mocks: {
                    userService : {
                        findAllPaginated(page,size,sortBy,isAsc,filter,then,error){
                            then(EMPTY_USER_LIST)
                        }
                    }
                }
            })

            expect(wrapper.findComponent(UserCreationForm).exists()).toBe(false);
        })

        it('should show if user has authority to create user', () => {
            const wrapper = shallowMount(UserTab, {
                i18n,
                localVue,
                store: CREATE_USER_STORE,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    users: NOT_EMPTY_USER_LIST
                },
                mocks: {
                    userService : {
                        findAllPaginated(page,size,sortBy,isAsc,filter,then,error){
                            then(EMPTY_USER_LIST)
                        }
                    }
                }
            })
            expect(wrapper.findComponent(UserCreationForm).exists()).toBe(true);
        })
    })

    describe('users list', () => {
        it('should filter users with filter input string', () => {
            const wrapper = shallowMount(UserTab, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    users: NOT_EMPTY_USER_LIST
                },
                data(){
                    return{
                        search: 'admin'
                    }
                },
                mocks: {
                    userService : {
                        findAllPaginated(page,size,sortBy,isAsc,filter,then,error){
                            if(filter == 'admin'){
                                then(FILTER_USER_LIST)
                            }else{
                                then(NOT_EMPTY_USER_LIST)
                            }
                        }
                    }
                }
            })

            expect(wrapper.vm.users.length).toBe(1);
        })

        it('should add user to list when a new user is created', async () => {
            const wrapper = shallowMount(UserTab, {
                i18n,
                localVue,
                store: CREATE_USER_STORE,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    users: NOT_EMPTY_USER_LIST
                },
                mocks: {
                    userService : {
                        findAllPaginated(page,size,sortBy,isAsc,filter,then,error){
                            then(NOT_EMPTY_USER_LIST)    
                        }
                    }
                }
                
            })
    
            const userForm = wrapper.findComponent(UserCreationForm)
            userForm.vm.$emit('createUser', {name: 'test3'})
            expect(wrapper.vm.users.length).toBe(3)
        })
    })
})
