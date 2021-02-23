import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditBrowserForm from "@/views/AuditLaunch/form/AuditBrowserForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue();

describe('AuditBrowserForm', () => {
    it('should emit signal on browser change', async ()=>{
        const wrapper = shallowMount(AuditBrowserForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 'firefox',
                browsers: ['firefox', 'chrome']
            }
        })

        const browserBox = wrapper.find('#chrome');
        await browserBox.setChecked(true)
        expect(wrapper.emitted()).toHaveProperty('input')
    })
})
