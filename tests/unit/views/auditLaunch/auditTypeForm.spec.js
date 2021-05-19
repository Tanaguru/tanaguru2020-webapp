import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditTypeForm from "@/views/AuditLaunch/form/AuditTypeForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue();

describe('AuditTypeForm', () => {
    it('should emit signal on type change', async ()=>{
        const wrapper = shallowMount(AuditTypeForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 'page',
                types: ['page', 'site']
            }
        })

        const typeInput = wrapper.find('#site');
        await typeInput.setChecked(true)

        expect(wrapper.emitted()).toHaveProperty('input')

    })
})
