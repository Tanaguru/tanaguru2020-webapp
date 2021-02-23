import {shallowMount} from '@vue/test-utils'
import Footer from "@/components/Footer";
import tanaguruLocalVueHelper from "../../helper/localVueHelper";
import Vuex from 'vuex'
import i18n from "@/i18n";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('Footer', () => {
    let getters
    let store

    beforeEach(() => {
        getters = {
            appVersion: () => 'test-app-version',
            serverVersion: () => 'test-server-version'
        }

        store = new Vuex.Store({
            getters
        })
    })

    it('renders the server and client versions', () => {
        const wrapper = shallowMount(Footer, {
            store,
            i18n,
            localVue,

        })
        const copyright = wrapper.find('.footer-copyright').text()
        expect(copyright).toContain(getters.appVersion())
        expect(copyright).toContain(getters.serverVersion())
    })
})
