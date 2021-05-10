import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import Vuex from "vuex";
import UserDetail from "@/views/User/UserDetail";
import VueRouter from 'vue-router'

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()
const router = new VueRouter();

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

describe('UserDetail', () => {
    it('should hide e-mail and blocked status if user isnt admin or on their own profile', () => {
        const wrapper = shallowMount(UserDetail, {
            i18n,
            localVue,
            router,
            store: NO_AUTHORITY_STORE,
            stubs: ['router-link', 'router-view'],
        })

        const emailLine = wrapper.find('#email')
        expect(emailLine.exists()).toBe(false);
        const blockedLine = wrapper.find('#blocked')
        expect(blockedLine.exists()).toBe(false);
    })

    it('should not show modify button if user isn\'t admin or on his own profile', () => {
        const wrapper = shallowMount(UserDetail, {
            i18n,
            localVue,
            router,
            store: NO_AUTHORITY_STORE,
            stubs: ['router-link', 'router-view'],
        })

        const modifyButton = wrapper.find('.btn btn--default btn-modify')
        expect(modifyButton.exists()).toBe(false);
    })

    it('should not show app role select if user doesn\'t have PROMOTE_USER authority', () => {
        const wrapper = shallowMount(UserDetail, {
            i18n,
            localVue,
            router,
            store: NO_AUTHORITY_STORE,
            stubs: ['router-link', 'router-view'],
        })

        const approleSelect = wrapper.find('#select-approle')
        expect(approleSelect.exists()).toBe(false);
    })
})