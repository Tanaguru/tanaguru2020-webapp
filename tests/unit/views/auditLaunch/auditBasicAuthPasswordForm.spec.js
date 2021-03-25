import {shallowMount} from '@vue/test-utils'
import tanaguruLocalVueHelper from "../../../helper/localVueHelper";
import i18n from "@/i18n";
import AuditBasicAuthPasswordForm from "@/views/AuditLaunch/form/BasicAuthPasswordForm";

const localVue = tanaguruLocalVueHelper.getTanaguruLocalVue()

describe('AuditBasicAuthPasswordForm', () => {
    it('should show error if password is invalid (4)', async () => {
        const wrapper = shallowMount(AuditBasicAuthPasswordForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ''
            }
        })

        const passwordInput = wrapper.find('#password');
        await passwordInput.setValue('test');
        await passwordInput.trigger('blur')

        const passwordError = wrapper.find('#password-error')
        expect(passwordError.exists()).toBe(true)
    })

    it('should not show error if password is valid', async () => {
        const wrapper = shallowMount(AuditBasicAuthPasswordForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ''
            }
        })

        const passwordInput = wrapper.find('#password');
        await passwordInput.setValue('validpassword');

        const passwordError = wrapper.find('#password-error')
        expect(passwordError.exists()).toBe(false)
    })

    it('should not show error if password is empty', async () => {
        const wrapper = shallowMount(AuditBasicAuthPasswordForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ''
            }
        })

        const passwordError = wrapper.find('#password-error')
        expect(passwordError.exists()).toBe(false)
    })

    it('should emit input signal when field change', async () => {
        const wrapper = shallowMount(AuditBasicAuthPasswordForm, {
            i18n,
            localVue,
            stubs: ['router-link', 'router-view'],
            propsData: {
                value: ''
            }
        })

        const passwordInput = wrapper.find('#password');
        await passwordInput.setValue('Password!5');
        await passwordInput.trigger('blur')

        expect(wrapper.emitted()).toHaveProperty('input')
    })
})
