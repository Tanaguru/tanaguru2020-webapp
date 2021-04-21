import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditEnableScreenshotForm from "@/views/AuditLaunch/form/AuditEnableScreenshotForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue();

describe('AuditEnableScreenshotForm', () => {
    it('should emit signal on change', async ()=>{
        const wrapper = shallowMount(AuditEnableScreenshotForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 'no',
                screenshot: ['yes', 'no']
            }
        })

        const screenshotInput = wrapper.find('#screenshotYes');
        await screenshotInput.setChecked(true)
        
        expect(wrapper.emitted()).toHaveProperty('input')

    })
})
