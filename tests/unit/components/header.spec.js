import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../helper/localVueHelper";
import Header from "@/components/Header";
import Banner from "@/components/Banner";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('Header', () => {
    it('renders the banner', () => {
        const wrapper = shallowMount(Header, {
            localVue,
            computed: {
                currentUser() { return null }
            },
            mocks: {
                $t: (msg) => msg
            }
        })

        const banner = wrapper.findComponent(Banner)
        expect(banner.exists()).toBe(true)
    })

    //TODO check wich menu is rendered

})
