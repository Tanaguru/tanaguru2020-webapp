import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditNameForm from "@/views/AuditLaunch/form/AuditNameForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue();

describe('AuditNameForm', () => {
    it('should show error on blur if name is empty', async ()=>{
        const wrapper = shallowMount(AuditNameForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: 'NewAudit',
            }
        })

        const nameInput = wrapper.find('#name');
        await nameInput.setValue('');
        await nameInput.trigger('blur');

        const emptyError = wrapper.find('#name-error')
        expect(emptyError.exists()).toBe(true)

    })
})
