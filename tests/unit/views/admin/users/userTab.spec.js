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
const NOT_EMPTY_USER_LIST = [
    {
        username: 'admin',
        email: 'admin@test.com'
    },
    {
        username: 'test',
        email: 'test@test.com'
    }
]

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
                }
            })
            expect(wrapper.findComponent(UserCreationForm).exists()).toBe(true);
        })
    })

    describe('contracts list', () => {
        it('should filter users with filter input string', () => {
            const wrapper = shallowMount(UserTab, {
                i18n,
                localVue,
                store: NO_AUTHORITY_STORE,
                stubs: ['router-link', 'router-view'],
                propsData: {
                    users: NOT_EMPTY_USER_LIST
                }
            })

            wrapper.setData({
                search: 'admin'
            })
            expect(wrapper.vm.filteredUsers.length).toBe(1);
        })
    })
})
