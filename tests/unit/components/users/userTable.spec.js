import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import Vuex from "vuex";
import UserTable from "@/components/users/UserTable";

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

const DELETE_USER_STORE = new Vuex.Store({
    state : {
        auth : {
            authorities : {
                DELETE_USER: true
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
        name: 'test1'
    },
    {
        name: 'test2'
    }
]

describe('UserTable', () => {
    it('should hide delete user button if user does not have authority', () => {
        const wrapper = shallowMount(UserTable, {
            i18n,
            localVue,
            store: NO_AUTHORITY_STORE,
            stubs: ['router-link', 'router-view']
        })

        const deleteButton = wrapper.find('.actions-list__item .btn-delete ')
        expect(deleteButton.exists()).toBe(false);
    })

    it('should show delete user button if user has authority', () => {
        const wrapper = shallowMount(UserTable, {
            i18n,
            localVue,
            store: DELETE_USER_STORE,
            stubs: ['router-link', 'router-view'],
            propsData: {
                users: NOT_EMPTY_USER_LIST
            }
        })

        const deleteButton = wrapper.find('.actions-list__item .btn-delete')
        expect(deleteButton.exists()).toBe(true);
    })
})

